import logging
import os
import json
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments, 
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import (
    LoraConfig, 
    get_peft_model, 
    TaskType,
    PeftModel
)
from datasets import Dataset as HFDataset
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
import pickle
import time

# MPS 완전 비활성화
if hasattr(torch.backends, 'mps'):
    torch.backends.mps.enabled = False
    os.environ['PYTORCH_ENABLE_MPS_FALLBACK'] = '1'
    os.environ['PYTORCH_MPS_HIGH_WATERMARK_RATIO'] = '0.0'
    # MPS 백엔드 강제 비활성화
    try:
        torch._C._jit_set_profiling_mode(False)
        torch._C._jit_set_profiling_executor(False)
    except:
        pass

# CPU 강제 사용
os.environ['CUDA_VISIBLE_DEVICES'] = ''
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'max_split_size_mb:128'

logger = logging.getLogger(__name__)

class HarmonyTransformer(nn.Module):
    """화성학 특화 Transformer 모델"""
    
    def __init__(
        self,
        vocab_size: int = 10000,
        d_model: int = 512,
        nhead: int = 8,
        num_layers: int = 6,
        dropout: float = 0.1,
        max_seq_length: int = 512
    ):
        super().__init__()
        
        self.d_model = d_model
        self.max_seq_length = max_seq_length
        
        # 임베딩 레이어
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.position_embedding = nn.Embedding(max_seq_length, d_model)
        
        # 화성학 특화 레이어
        self.harmony_embedding = nn.Embedding(100, d_model)  # 화성 기능 임베딩
        self.key_embedding = nn.Embedding(50, d_model)       # 조성 임베딩
        
        # Transformer 인코더
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=d_model * 4,
            dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        
        # 출력 레이어
        self.output_projection = nn.Linear(d_model, vocab_size)
        self.dropout = nn.Dropout(dropout)
        
        # 화성학 특화 출력
        self.harmony_classifier = nn.Linear(d_model, 100)  # 화성 기능 분류
        self.key_classifier = nn.Linear(d_model, 50)       # 조성 분류
        
        # 가중치 초기화
        self._init_weights()
    
    def _init_weights(self):
        """가중치 초기화"""
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                if module.bias is not None:
                    nn.init.zeros_(module.bias)
            elif isinstance(module, nn.Embedding):
                nn.init.normal_(module.weight, mean=0.0, std=0.02)
    
    def forward(
        self, 
        input_ids: torch.Tensor,
        attention_mask: Optional[torch.Tensor] = None,
        harmony_ids: Optional[torch.Tensor] = None,
        key_ids: Optional[torch.Tensor] = None
    ) -> Dict[str, torch.Tensor]:
        """순전파"""
        batch_size, seq_len = input_ids.shape
        
        # 위치 인덱스 생성
        position_ids = torch.arange(seq_len, device=input_ids.device).unsqueeze(0).expand(batch_size, -1)
        
        # 임베딩 결합
        token_embeds = self.token_embedding(input_ids)
        position_embeds = self.position_embedding(position_ids)
        
        # 화성학 특화 임베딩 추가
        embeddings = token_embeds + position_embeds
        
        if harmony_ids is not None:
            harmony_embeds = self.harmony_embedding(harmony_ids)
            embeddings = embeddings + harmony_embeds
        
        if key_ids is not None:
            key_embeds = self.key_embedding(key_ids)
            embeddings = embeddings + key_embeds
        
        embeddings = self.dropout(embeddings)
        
        # Transformer 인코더 통과
        if attention_mask is not None:
            # attention_mask를 transformer에 맞는 형태로 변환
            transformer_mask = attention_mask == 0
        else:
            transformer_mask = None
        
        encoded = self.transformer(embeddings, src_key_padding_mask=transformer_mask)
        
        # 출력 생성
        logits = self.output_projection(encoded)
        harmony_logits = self.harmony_classifier(encoded)
        key_logits = self.key_classifier(encoded)
        
        return {
            'logits': logits,
            'harmony_logits': harmony_logits,
            'key_logits': key_logits,
            'hidden_states': encoded
        }

class HarmonyDataset(Dataset):
    """화성학 데이터셋"""
    
    def __init__(
        self, 
        corpus_items: List[Any],
        tokenizer,
        max_length: int = 512,
        include_harmony: bool = True
    ):
        self.corpus_items = corpus_items
        self.tokenizer = tokenizer
        self.max_length = max_length
        self.include_harmony = include_harmony
        
        # 데이터 전처리
        self.processed_data = self._preprocess_data()
    
    def _preprocess_data(self) -> List[Dict[str, Any]]:
        """데이터 전처리"""
        processed = []
        
        for item in self.corpus_items:
            try:
                # 분석 파일에서 화성 데이터 추출
                if hasattr(item, 'analysis_path') and item.analysis_path:
                    harmony_data = self._extract_harmony_data(item.analysis_path)
                    if harmony_data:
                        processed.append(harmony_data)
            except Exception as e:
                logger.debug(f"데이터 전처리 실패 {item}: {e}")
                continue
        
        return processed
    
    def _harmony_to_text(self, harmony_sequence: List[Dict[str, Any]]) -> str:
        """화성 시퀀스를 텍스트로 변환 (개선된 버전)"""
        if not harmony_sequence:
            return ""
        
        text_parts = []
        
        for harmony in harmony_sequence:
            measure_text = f"m{harmony['measure']}"
            key_text = f"{harmony['key']}:{harmony['roman_numeral']}"
            text_parts.append(f"{measure_text} {key_text}")
        
        # 마디 간 구분자로 | 사용
        result = " | ".join(text_parts)
        
        # 시작과 끝 토큰 추가
        result = f"<START> {result} <END>"
        
        return result
    
    def _extract_harmony_data(self, analysis_path: str) -> Optional[Dict[str, Any]]:
        """분석 파일에서 화성 데이터 추출 (개선된 버전)"""
        try:
            with open(analysis_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 마디별 화성 분석 추출
            lines = content.split('\n')
            harmony_sequence = []
            
            for line in lines:
                line = line.strip()
                if line.startswith('m') and ':' in line:
                    # 마디 분석 파싱
                    harmony_info = self._parse_harmony_line(line)
                    if harmony_info:
                        harmony_sequence.append(harmony_info)
            
            if not harmony_sequence:
                return None
            
            # 텍스트 형태로 변환
            text_sequence = self._harmony_to_text(harmony_sequence)
            
            # 추가 메타데이터
            metadata = {
                'total_measures': len(harmony_sequence),
                'key_changes': len(set(h['key'] for h in harmony_sequence)),
                'complexity': self._calculate_sequence_complexity(harmony_sequence)
            }
            
            return {
                'text': text_sequence,
                'harmony_sequence': harmony_sequence,
                'analysis_path': analysis_path,
                'metadata': metadata
            }
            
        except Exception as e:
            logger.debug(f"화성 데이터 추출 실패 {analysis_path}: {e}")
            return None
    
    def _parse_harmony_line(self, line: str) -> Optional[Dict[str, Any]]:
        """마디 라인 파싱"""
        try:
            parts = line.split()
            if len(parts) < 2:
                return None
            
            # 마디 번호 추출
            measure_part = parts[0]
            if not measure_part.startswith('m'):
                return None
            
            measure = int(measure_part[1:])
            
            # 로마 숫자와 키 정보 추출
            roman_numeral = None
            key = None
            
            for part in parts[1:]:
                if ':' in part:
                    key_part = part.rstrip(':')
                    if len(key_part) <= 3:
                        key = key_part
                elif part in ['i', 'I', 'ii', 'II', 'iii', 'III', 'iv', 'IV', 'v', 'V', 'vi', 'VI', 'vii', 'VII']:
                    roman_numeral = part
            
            if not roman_numeral:
                return None
            
            return {
                'measure': measure,
                'roman_numeral': roman_numeral,
                'key': key or 'C'
            }
            
        except Exception as e:
            logger.debug(f"마디 라인 파싱 실패: {line} - {e}")
            return None
    
    def _calculate_sequence_complexity(self, harmony_sequence: List[Dict[str, Any]]) -> float:
        """화성 시퀀스의 복잡도 계산"""
        if not harmony_sequence:
            return 0.0
        
        complexity = 0.0
        
        # 마디 수에 따른 기본 복잡도
        complexity += len(harmony_sequence) * 0.1
        
        # 키 변화에 따른 복잡도
        keys = [h['key'] for h in harmony_sequence]
        unique_keys = len(set(keys))
        complexity += unique_keys * 0.2
        
        # 화성 기능 다양성
        functions = [h['roman_numeral'] for h in harmony_sequence]
        unique_functions = len(set(functions))
        complexity += unique_functions * 0.15
        
        # 특수 화성 (7th, dim, aug 등)
        special_harmonies = ['7', 'dim', 'aug', 'sus', 'b', '#']
        for harmony in harmony_sequence:
            for special in special_harmonies:
                if special in harmony['roman_numeral']:
                    complexity += 0.3
        
        return min(complexity, 1.0)
    
    def __len__(self) -> int:
        return len(self.processed_data)
    
    def __getitem__(self, idx: int) -> Dict[str, Any]:
        data = self.processed_data[idx]
        
        # 토크나이징
        encoding = self.tokenizer(
            data['text'],
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        # 배치 차원 제거
        for key in encoding:
            encoding[key] = encoding[key].squeeze(0)
        
        return encoding

class HarmonyTransformerService:
    """Harmony Transformer 서비스"""
    
    def __init__(self, model_name: str = "microsoft/DialoGPT-medium"):
        self.model_name = model_name
        self.model = None
        self.tokenizer = None
        
        # CPU 강제 사용 (MPS 문제 완전 해결)
        self.device = torch.device("cpu")
        
        # 모델 설정
        self.config = {
            'vocab_size': 10000,
            'd_model': 512,
            'nhead': 8,
            'num_layers': 6,
            'dropout': 0.1,
            'max_seq_length': 512
        }
        
        logger.info(f"Harmony Transformer 서비스 초기화 (디바이스: {self.device})")
        logger.info("MPS 호환성 문제를 피하기 위해 CPU를 강제로 사용합니다.")
    
    def load_model(self) -> Dict[str, Any]:
        """모델 로드"""
        try:
            logger.info(f"모델 로드 중: {self.model_name}")
            
            # 토크나이저 로드
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            
            # 특수 토큰 추가
            special_tokens = {
                'pad_token': '[PAD]',
                'sep_token': '[SEP]',
                'additional_special_tokens': ['[HARMONY]', '[KEY]']
            }
            
            # 특수 토큰 추가
            num_added = self.tokenizer.add_special_tokens(special_tokens)
            logger.info(f"추가된 특수 토큰 수: {num_added}")
            
            # 기본 모델 로드 (CPU 강제 사용)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float32,
                device_map=None,  # CPU 강제 사용
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
            
            # 토크나이저 크기 변경에 맞춰 모델 임베딩 레이어 크기 조정
            if num_added > 0:
                self.model.resize_token_embeddings(len(self.tokenizer))
            
            # CPU로 강제 이동 및 확인
            self.model = self.model.to(self.device)
            logger.info(f"모델이 {self.device}에 로드되었습니다: {self.model.device}")
            
            # 모든 모듈을 CPU로 강제 이동
            for param in self.model.parameters():
                param.data = param.data.to(self.device)
            
            # LoRA 설정
            lora_config = LoraConfig(
                task_type=TaskType.CAUSAL_LM,
                inference_mode=False,
                r=16,
                lora_alpha=32,
                lora_dropout=0.1,
                target_modules=["q_proj", "v_proj"]
            )
            
            # PEFT 모델로 변환
            self.model = get_peft_model(self.model, lora_config)
            
            # PEFT 모델도 CPU로 이동
            self.model = self.model.to(self.device)
            
            # 모든 PEFT 파라미터도 CPU로 강제 이동
            for param in self.model.parameters():
                param.data = param.data.to(self.device)
            
            logger.info(f"PEFT 모델이 {self.device}에 로드되었습니다: {self.model.device}")
            
            logger.info("모델 로드 완료")
            
            return {
                'model_name': self.model_name,
                'device': str(self.device),
                'lora_config': lora_config,
                'total_params': sum(p.numel() for p in self.model.parameters()),
                'trainable_params': sum(p.numel() for p in self.model.parameters() if p.requires_grad)
            }
            
        except Exception as e:
            logger.error(f"모델 로드 실패: {e}")
            # 대안: 더 간단한 모델 사용
            logger.info("대안 모델 로드 시도...")
            return self._load_simple_model()
    
    def _load_simple_model(self) -> Dict[str, Any]:
        """간단한 모델 로드 (대안)"""
        try:
            # 더 간단한 모델 사용
            simple_model_name = "distilgpt2"
            logger.info(f"간단한 모델 로드 시도: {simple_model_name}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(simple_model_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            self.model = AutoModelForCausalLM.from_pretrained(
                simple_model_name,
                torch_dtype=torch.float32,
                device_map=None,  # CPU 강제 사용
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
            
            # CPU로 강제 이동 및 확인
            self.model = self.model.to(self.device)
            logger.info(f"간단한 모델이 {self.device}에 로드되었습니다: {self.model.device}")
            
            # 모든 모듈을 CPU로 강제 이동
            for param in self.model.parameters():
                param.data = param.data.to(self.device)
            
            # LoRA 설정
            lora_config = LoraConfig(
                task_type=TaskType.CAUSAL_LM,
                inference_mode=False,
                r=8,  # 더 작은 rank
                lora_alpha=16,
                lora_dropout=0.1,
                target_modules=["c_attn", "c_proj"]  # GPT-2에 맞는 모듈
            )
            
            # PEFT 모델로 변환
            self.model = get_peft_model(self.model, lora_config)
            
            # PEFT 모델도 CPU로 이동
            self.model = self.model.to(self.device)
            
            # 모든 PEFT 파라미터도 CPU로 강제 이동
            for param in self.model.parameters():
                param.data = param.data.to(self.device)
            
            logger.info(f"간단한 PEFT 모델이 {self.device}에 로드되었습니다: {self.model.device}")
            
            logger.info("간단한 모델 로드 완료")
            
            return {
                'model_name': simple_model_name,
                'device': str(self.device),
                'lora_config': lora_config,
                'total_params': sum(p.numel() for p in self.model.parameters()),
                'trainable_params': sum(p.numel() for p in self.model.parameters() if p.requires_grad),
                'note': '간단한 모델로 대체됨'
            }
            
        except Exception as e:
            logger.error(f"간단한 모델 로드도 실패: {e}")
            raise
    
    def get_model_info(self) -> Dict[str, Any]:
        """모델 정보 반환"""
        if not self.model:
            return {'error': '모델이 로드되지 않았습니다'}
        
        return {
            'model_name': self.model_name,
            'device': str(self.device),
            'total_params': sum(p.numel() for p in self.model.parameters()),
            'trainable_params': sum(p.numel() for p in self.model.parameters() if p.requires_grad),
            'model_type': 'Harmony Transformer (LoRA)'
        }
    
    def prepare_training_data(self, corpus_items: List[Any]) -> Dict[str, Any]:
        """학습 데이터 준비"""
        try:
            if not self.tokenizer:
                raise ValueError("토크나이저가 로드되지 않았습니다")
            
            logger.info(f"학습 데이터 준비 중: {len(corpus_items)}개 아이템")
            
            # 데이터셋 생성
            dataset = HarmonyDataset(corpus_items, self.tokenizer)
            
            if len(dataset) == 0:
                raise ValueError("처리 가능한 데이터가 없습니다")
            
            # HuggingFace 데이터셋으로 변환
            hf_dataset = HFDataset.from_list([
                {
                    'text': item['text'],
                    'harmony_sequence': item['harmony_sequence']
                }
                for item in dataset.processed_data
            ])
            
            # 토크나이징
            def tokenize_function(examples):
                return self.tokenizer(
                    examples['text'],
                    truncation=True,
                    padding='max_length',
                    max_length=self.config['max_seq_length']
                )
            
            tokenized_dataset = hf_dataset.map(tokenize_function, batched=True)
            
            # 학습에 필요한 필드만 유지하고 나머지는 제거
            tokenized_dataset = tokenized_dataset.remove_columns(['text', 'harmony_sequence'])
            
            logger.info(f"학습 데이터 준비 완료: {len(tokenized_dataset)}개 예시")
            
            return {
                'total_examples': len(tokenized_dataset),
                'features': list(tokenized_dataset.features.keys()),
                'sample_data': tokenized_dataset[0] if len(tokenized_dataset) > 0 else None,
                'dataset': tokenized_dataset
            }
            
        except Exception as e:
            logger.error(f"학습 데이터 준비 실패: {e}")
            raise
    
    def start_training(self, training_data: Dict[str, Any], output_dir: str = None):
        """모델 파인튜닝 시작 (최적화된 버전)"""
        try:
            if not self.model or not self.tokenizer:
                raise ValueError("모델과 토크나이저가 로드되지 않았습니다")
            
            if not training_data.get('dataset'):
                raise ValueError("학습 데이터가 준비되지 않았습니다")
            
            # 출력 디렉토리 설정
            if not output_dir:
                output_dir = f"models/harmony_transformer_finetuned_{int(time.time())}"
            
            os.makedirs(output_dir, exist_ok=True)
            
            # 데이터셋 크기에 따른 동적 설정
            dataset_size = len(training_data['dataset'])
            
            # 에포크 수 계산 (데이터셋 크기에 따라 조정)
            if dataset_size < 50:
                num_epochs = 5
                batch_size = 2
                warmup_steps = 10
                save_steps = 25
            elif dataset_size < 200:
                num_epochs = 4
                batch_size = 4
                warmup_steps = 20
                save_steps = 50
            else:
                num_epochs = 3
                batch_size = 8
                warmup_steps = 50
                save_steps = 100
            
            # 학습 인수 설정 (최적화된 설정)
            training_args = TrainingArguments(
                output_dir=output_dir,
                num_train_epochs=num_epochs,
                per_device_train_batch_size=batch_size,
                per_device_eval_batch_size=batch_size,
                warmup_steps=warmup_steps,
                weight_decay=0.01,
                learning_rate=2e-4,  # 더 낮은 학습률로 안정적인 학습
                lr_scheduler_type="cosine",  # 코사인 스케줄러
                logging_dir=f"{output_dir}/logs",
                logging_steps=max(1, warmup_steps // 5),
                save_steps=save_steps,
                save_total_limit=3,  # 최대 3개 체크포인트 유지
                dataloader_pin_memory=False,
                remove_unused_columns=False,
                report_to=None,  # Weights & Biases 비활성화
                # 그라디언트 클리핑
                max_grad_norm=1.0,
                # 혼합 정밀도 학습 비활성화 (CPU 사용 시)
                fp16=False,
                dataloader_num_workers=0  # macOS에서 안정성을 위해
            )
            
            # 데이터 콜레이터
            data_collator = DataCollatorForLanguageModeling(
                tokenizer=self.tokenizer,
                mlm=False  # Causal Language Modeling
            )
            
            # 트레이너 생성
            trainer = Trainer(
                model=self.model,
                args=training_args,
                train_dataset=training_data['dataset'],
                data_collator=data_collator,
                tokenizer=self.tokenizer
            )
            
            # 학습 시작
            logger.info(f"모델 파인튜닝 시작 (에포크: {num_epochs}, 배치 크기: {batch_size})")
            start_time = time.time()
            
            train_result = trainer.train()
            
            end_time = time.time()
            training_duration = end_time - start_time
            
            # 모델 저장
            trainer.save_model()
            self.tokenizer.save_pretrained(output_dir)
            
            # 학습 완료 후 모델을 CPU로 강제 이동
            self.ensure_model_on_cpu()
            
            # 학습 요약 생성
            training_summary = {
                "dataset_size": len(training_data),
                "epochs": training_args.num_train_epochs,
                "batch_size": training_args.per_device_train_batch_size,
                "training_time": train_result.metrics.get("train_runtime", 0),
                "final_loss": train_result.metrics.get("train_loss", 0)
            }
            
            logger.info("모델 파인튜닝 완료!")
            return {
                'success': True,
                'output_dir': output_dir,
                'training_summary': training_summary
            }
            
        except Exception as e:
            logger.error(f"모델 파인튜닝 실패: {e}")
            raise
    
    def generate_harmony_suggestions(
        self, 
        context: str, 
        style: str = "classical", 
        length: int = 4
    ) -> List[Dict[str, Any]]:
        """화성 진행 제안 생성"""
        try:
            if not self.model or not self.tokenizer:
                raise ValueError("모델과 토크나이저가 로드되지 않았습니다")
            
            # 컨텍스트 토크나이징
            inputs = self.tokenizer(
                context,
                return_tensors="pt",
                truncation=True,
                max_length=self.config['max_seq_length'] - length
            )
            
            # 모델과 같은 디바이스로 이동
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # 생성
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=inputs['input_ids'].shape[1] + length,
                    num_return_sequences=3,
                    do_sample=True,
                    temperature=0.8,
                    top_p=0.9,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id
                )
            
            # 결과 디코딩
            suggestions = []
            for output in outputs:
                generated_text = self.tokenizer.decode(output, skip_special_tokens=True)
                suggestion_text = generated_text[len(context):].strip()
                
                if suggestion_text:
                    suggestions.append({
                        'progression': suggestion_text.split(' | '),
                        'confidence': 0.8,
                        'style': style,
                        'explanation': f"{style} 스타일의 {length}마디 화성 진행"
                    })
            
            return suggestions
            
        except Exception as e:
            logger.error(f"화성 진행 제안 생성 실패: {e}")
            raise
    
    def analyze_harmony_progression(self, progression: str) -> Dict[str, Any]:
        """화성 진행 분석"""
        try:
            if not self.model or not self.tokenizer:
                raise ValueError("모델과 토크나이저가 로드되지 않았습니다")
            
            # 진행을 마디별로 분리
            measures = progression.split(' | ')
            
            # 각 마디 분석
            analysis = {
                'progression': measures,
                'functions': [],
                'cadence_patterns': [],
                'modulation_analysis': [],
                'complexity_score': 0.0
            }
            
            # 화성 기능 분석
            for i, measure in enumerate(measures):
                if ':' in measure:
                    key, roman = measure.split(':', 1)
                    function = self._analyze_harmonic_function(roman, key)
                    analysis['functions'].append(function)
                    
                    # 종지 패턴 감지
                    if i > 0 and i == len(measures) - 1:
                        prev_function = analysis['functions'][i-1]
                        if self._is_cadence(prev_function, function):
                            analysis['cadence_patterns'].append(f"m{i}-{i+1}: {prev_function} → {function}")
                    
                    # 전조 감지
                    if i > 0:
                        prev_key = measures[i-1].split(':', 1)[0] if ':' in measures[i-1] else 'C'
                        if key != prev_key:
                            analysis['modulation_analysis'].append(f"m{i+1}: {prev_key} → {key}")
            
            # 복잡도 점수 계산
            analysis['complexity_score'] = self._calculate_complexity(analysis)
            
            return analysis
            
        except Exception as e:
            logger.error(f"화성 진행 분석 실패: {e}")
            raise
    
    def _analyze_harmonic_function(self, roman: str, key: str) -> str:
        """화성 기능 분석"""
        # 간단한 화성 기능 매핑
        function_map = {
            'I': 'Tonic',
            'i': 'Tonic (minor)',
            'V': 'Dominant',
            'v': 'Dominant (minor)',
            'IV': 'Subdominant',
            'iv': 'Subdominant (minor)',
            'vi': 'Submediant',
            'VI': 'Submediant (major)',
            'ii': 'Supertonic',
            'II': 'Supertonic (major)',
            'iii': 'Mediant',
            'III': 'Mediant (major)',
            'vii': 'Leading tone',
            'VII': 'Leading tone (major)'
        }
        
        return function_map.get(roman, 'Unknown')
    
    def _is_cadence(self, prev_function: str, current_function: str) -> bool:
        """종지 패턴 감지"""
        cadence_patterns = [
            ('Dominant', 'Tonic'),
            ('Subdominant', 'Tonic'),
            ('Dominant', 'Submediant'),
            ('Leading tone', 'Tonic')
        ]
        
        return (prev_function, current_function) in cadence_patterns
    
    def _calculate_complexity(self, analysis: Dict[str, Any]) -> float:
        """복잡도 점수 계산"""
        score = 0.0
        
        # 마디 수에 따른 기본 점수
        score += len(analysis['progression']) * 0.1
        
        # 전조 수에 따른 점수
        score += len(analysis['modulation_analysis']) * 0.3
        
        # 다양한 화성 기능 사용
        unique_functions = len(set(analysis['functions']))
        score += unique_functions * 0.2
        
        # 종지 패턴
        score += len(analysis['cadence_patterns']) * 0.2
        
        return min(score, 1.0)
    
    def save_model(self, output_dir: str = None) -> str:
        """파인튜닝된 모델을 저장합니다."""
        if not self.model:
            return ""
        
        try:
            # CPU 환경에서 안전한 타임스탬프 생성
            import time
            timestamp = int(time.time())
            
            if output_dir is None:
                output_dir = f"models/harmony_transformer_saved_{timestamp}"
            
            # 디렉토리 생성
            os.makedirs(output_dir, exist_ok=True)
            
            # 모델 저장
            self.model.save_pretrained(output_dir)
            self.tokenizer.save_pretrained(output_dir)
            
            # 설정 정보 저장
            config_info = {
                "model_name": self.model_name,
                "device": str(self.device),
                "config": self.config,
                "timestamp": timestamp,
                "saved_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            config_file = os.path.join(output_dir, "config.json")
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(config_info, f, ensure_ascii=False, indent=2)
            
            logger.info(f"모델이 성공적으로 저장되었습니다: {output_dir}")
            return output_dir
            
        except Exception as e:
            logger.error(f"모델 저장 실패: {e}")
            return ""
    
    def load_fine_tuned_model(self, model_path: str) -> bool:
        """파인튜닝된 모델 로드"""
        try:
            if not os.path.exists(model_path):
                raise ValueError(f"모델 경로가 존재하지 않습니다: {model_path}")
            
            logger.info(f"파인튜닝된 모델 로드 중: {model_path}")
            
            # 모델 로드
            self.model = PeftModel.from_pretrained(
                self.model,
                model_path,
                torch_dtype=torch.float32,
                device_map=self.device
            )
            
            # 토크나이저 로드
            if os.path.exists(f"{model_path}/tokenizer.json"):
                self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            
            logger.info("파인튜닝된 모델 로드 완료")
            return True
            
        except Exception as e:
            logger.error(f"파인튜닝된 모델 로드 실패: {e}")
            return False
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """사용 가능한 모델 목록"""
        models_dir = Path("models")
        available_models = []
        
        if models_dir.exists():
            for model_dir in models_dir.iterdir():
                if model_dir.is_dir():
                    # 모델 파일 확인
                    model_files = list(model_dir.glob("*.bin")) + list(model_dir.glob("*.safetensors"))
                    if model_files:
                        available_models.append({
                            'name': model_dir.name,
                            'path': str(model_dir),
                            'type': 'fine_tuned' if 'finetuned' in model_dir.name else 'saved',
                            'files': [str(f.name) for f in model_files]
                        })
        
        return available_models
    
    def get_training_status(self) -> Dict[str, Any]:
        """학습 상태 반환"""
        # 실제 구현에서는 학습 진행 상황을 추적해야 함
        return {
            'status': 'idle',
            'current_epoch': 0,
            'total_epochs': 0,
            'loss': 0.0,
            'progress': 0.0
        }
    
    def batch_analysis(self, corpus_items: List[Any] = None):
        """배치 화성 분석"""
        try:
            if not corpus_items:
                logger.warning("분석할 코퍼스 아이템이 없습니다")
                return
            
            logger.info(f"배치 화성 분석 시작: {len(corpus_items)}개 아이템")
            
            results = []
            for i, item in enumerate(corpus_items):
                try:
                    if hasattr(item, 'analysis_path') and item.analysis_path:
                        # 화성 분석 수행
                        analysis = self.analyze_harmony_progression(
                            self._extract_text_from_analysis(item.analysis_path)
                        )
                        
                        results.append({
                            'item': item,
                            'analysis': analysis,
                            'status': 'success'
                        })
                        
                        if (i + 1) % 10 == 0:
                            logger.info(f"진행률: {i + 1}/{len(corpus_items)}")
                            
                except Exception as e:
                    logger.error(f"아이템 분석 실패 {i}: {e}")
                    results.append({
                        'item': item,
                        'analysis': None,
                        'status': 'failed',
                        'error': str(e)
                    })
            
            # 결과 저장
            output_path = f"batch_analysis_results_{int(torch.cuda.Event().elapsed_time())}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            
            logger.info(f"배치 분석 완료: {output_path}")
            
        except Exception as e:
            logger.error(f"배치 분석 실패: {e}")
            raise
    
    def _extract_text_from_analysis(self, analysis_path: str) -> str:
        """분석 파일에서 텍스트 추출"""
        try:
            with open(analysis_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 마디별 화성 정보 추출
            lines = content.split('\n')
            harmony_parts = []
            
            for line in lines:
                line = line.strip()
                if line.startswith('m') and ':' in line:
                    harmony_parts.append(line)
            
            return " | ".join(harmony_parts)
            
        except Exception as e:
            logger.error(f"텍스트 추출 실패 {analysis_path}: {e}")
            return ""

    def test_model(self, test_prompts: List[str] = None) -> Dict[str, Any]:
        """파인튜닝된 모델을 테스트합니다."""
        if not self.model:
            return {"success": False, "error": "모델이 로드되지 않았습니다."}
        
        # 테스트 전에 모델을 CPU로 강제 이동
        self.model = self.model.to(self.device)
        logger.info(f"테스트를 위해 모델을 {self.device}로 이동: {self.model.device}")
        
        # 모든 파라미터도 CPU로 강제 이동
        for param in self.model.parameters():
            param.data = param.data.to(self.device)
        
        if test_prompts is None:
            test_prompts = [
                "C F G",
                "Am Dm G C",
                "F Bb C"
            ]
        
        results = []
        for i, prompt in enumerate(test_prompts, 1):
            try:
                # 입력을 CPU로 이동
                inputs = self.tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                logger.info(f"테스트 {i}: 입력 '{prompt}'을 {self.device}에서 처리")
                
                # 생성
                with torch.no_grad():
                    outputs = self.model.generate(
                        **inputs,
                        max_length=50,
                        num_return_sequences=1,
                        temperature=0.8,
                        do_sample=True,
                        pad_token_id=self.tokenizer.eos_token_id
                    )
                
                # 결과 디코딩
                generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                results.append({
                    "prompt": prompt,
                    "generated": generated_text,
                    "success": True
                })
                logger.info(f"테스트 {i} 성공: {generated_text}")
                
            except Exception as e:
                error_msg = f"테스트 {i} 실패: {str(e)}"
                logger.error(error_msg)
                results.append({
                    "prompt": prompt,
                    "error": str(e),
                    "success": False
                })
        
        return {
            "success": True,
            "results": results,
            "device_used": str(self.device)
        }

    def ensure_model_on_cpu(self):
        """학습 완료 후 모델을 CPU로 강제 이동합니다."""
        if self.model:
            # 모델을 CPU로 강제 이동
            self.model = self.model.to(self.device)
            
            # 모든 파라미터도 CPU로 강제 이동
            for param in self.model.parameters():
                param.data = param.data.to(self.device)
            
            # 모든 모듈도 CPU로 강제 이동
            for module in self.model.modules():
                if hasattr(module, 'to'):
                    module.to(self.device)
            
            logger.info(f"모델이 {self.device}로 강제 이동되었습니다: {self.model.device}")
            return True
        return False

# 서비스 인스턴스 생성
harmony_transformer_service = HarmonyTransformerService()
