import logging
import sys
from typing import Dict, List, Optional, Any, Tuple
import json
from pathlib import Path
import os

logger = logging.getLogger(__name__)

# torch 의존성 확인 및 선택적 로드
try:
    import torch
    import torch.nn as nn
    from transformers import (
        AutoTokenizer, 
        AutoModelForCausalLM, 
        TrainingArguments, 
        Trainer,
        DataCollatorForLanguageModeling
    )
    from datasets import Dataset
    import numpy as np
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    logger.warning("PyTorch 및 Transformers가 설치되지 않았습니다. AI 모델 기능이 제한됩니다.")

class HarmonyTransformer:
    """Harmony Transformer 모델 서비스"""
    
    def __init__(self, model_name: str = "microsoft/DialoGPT-medium"):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        
        if TORCH_AVAILABLE:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            logger.info(f"Harmony Transformer 초기화: {model_name}")
            logger.info(f"사용 디바이스: {self.device}")
        else:
            logger.warning("PyTorch가 설치되지 않아 Harmony Transformer 기능이 제한됩니다.")
    
    def load_model(self):
        """모델 및 토크나이저 로드"""
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch가 설치되지 않았습니다. AI 모델 기능을 사용하려면 PyTorch를 설치하세요.")
        
        try:
            logger.info("모델 로딩 시작...")
            
            # 토크나이저 로드
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # 모델 로드
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            
            # GPU로 이동
            if not torch.cuda.is_available():
                self.model = self.model.to(self.device)
            
            logger.info("모델 로딩 완료")
            
        except Exception as e:
            logger.error(f"모델 로딩 실패: {e}")
            raise
    
    def prepare_training_data(self, corpus_data: List[Dict[str, Any]]):
        """코퍼스 데이터를 학습 데이터로 변환"""
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch가 설치되지 않았습니다.")
        
        try:
            logger.info("학습 데이터 준비 시작...")
            
            training_examples = []
            
            for item in corpus_data:
                # 화성 분석 텍스트 생성
                harmony_text = self._create_harmony_text(item)
                if harmony_text:
                    training_examples.append({
                        "text": harmony_text,
                        "genre": item.get("genre", "unknown"),
                        "composer": item.get("composer", "unknown"),
                        "key_signature": item.get("metadata", {}).get("key_signature", "C"),
                        "time_signature": item.get("metadata", {}).get("time_signature", "4/4")
                    })
            
            # Dataset 생성
            dataset = Dataset.from_list(training_examples)
            
            logger.info(f"학습 데이터 준비 완료: {len(training_examples)}개 예시")
            return dataset
            
        except Exception as e:
            logger.error(f"학습 데이터 준비 실패: {e}")
            raise
    
    def _create_harmony_text(self, item: Dict[str, Any]) -> Optional[str]:
        """코퍼스 아이템에서 화성 분석 텍스트 생성"""
        try:
            # 기본 정보
            genre = item.get("genre", "unknown")
            composer = item.get("composer", "unknown")
            key = item.get("metadata", {}).get("key_signature", "C")
            time = item.get("metadata", {}).get("time_signature", "4/4")
            
            # 화성 분석 텍스트 생성
            harmony_text = f"Genre: {genre}\nComposer: {composer}\nKey: {key}\nTime: {time}\n"
            
            # 로마 숫자 분석이 있다면 추가
            if "harmony_analysis" in item and item["harmony_analysis"]:
                analysis = item["harmony_analysis"]
                
                if analysis.get("roman_numerals"):
                    harmony_text += "Roman Numerals: " + " ".join(analysis["roman_numerals"]) + "\n"
                
                if analysis.get("chord_progressions"):
                    harmony_text += "Progressions: " + " ".join(analysis["chord_progressions"]) + "\n"
                
                if analysis.get("cadences"):
                    harmony_text += "Cadences: " + " ".join(analysis["cadences"]) + "\n"
            
            return harmony_text
            
        except Exception as e:
            logger.debug(f"화성 텍스트 생성 실패: {e}")
            return None
    
    def tokenize_function(self, examples: Dict[str, Any]) -> Dict[str, Any]:
        """텍스트 토크나이징"""
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch가 설치되지 않았습니다.")
        
        return self.tokenizer(
            examples["text"],
            truncation=True,
            padding="max_length",
            max_length=512,
            return_tensors="pt"
        )
    
    def train_model(self, 
                   training_data, 
                   output_dir: str,
                   num_epochs: int = 3,
                   batch_size: int = 8,
                   learning_rate: float = 2e-5) -> bool:
        """모델 파인튜닝"""
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch가 설치되지 않았습니다.")
        
        try:
            logger.info("모델 파인튜닝 시작...")
            
            # 토크나이징된 데이터셋 생성
            tokenized_dataset = training_data.map(
                self.tokenize_function,
                batched=True,
                remove_columns=training_data.column_names
            )
            
            # 데이터 콜레이터
            data_collator = DataCollatorForLanguageModeling(
                tokenizer=self.tokenizer,
                mlm=False  # Causal Language Modeling
            )
            
            # 학습 인수 설정
            training_args = TrainingArguments(
                output_dir=output_dir,
                num_train_epochs=num_epochs,
                per_device_train_batch_size=batch_size,
                learning_rate=learning_rate,
                warmup_steps=100,
                logging_steps=10,
                save_steps=500,
                save_total_limit=2,
                prediction_loss_only=True,
                remove_unused_columns=False,
                dataloader_pin_memory=False,
                report_to=None,  # Weights & Biases 비활성화
            )
            
            # 트레이너 생성
            trainer = Trainer(
                model=self.model,
                args=training_args,
                train_dataset=tokenized_dataset,
                data_collator=data_collator,
            )
            
            # 모델 파인튜닝
            trainer.train()
            
            # 모델 저장
            trainer.save_model()
            self.tokenizer.save_pretrained(output_dir)
            
            logger.info(f"모델 파인튜닝 완료: {output_dir}")
            return True
            
        except Exception as e:
            logger.error(f"모델 파인튜닝 실패: {e}")
            return False
    
    def generate_harmony_suggestion(self, 
                                  prompt: str, 
                                  max_length: int = 100,
                                  temperature: float = 0.8) -> str:
        """화성 제안 생성"""
        if not TORCH_AVAILABLE:
            return "PyTorch가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다."
        
        try:
            if self.model is None or self.tokenizer is None:
                raise ValueError("모델이 로드되지 않았습니다")
            
            # 프롬프트 토크나이징
            inputs = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            
            # 생성
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_length=max_length,
                    temperature=temperature,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    num_return_sequences=1
                )
            
            # 결과 디코딩
            generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # 프롬프트 제거하고 생성된 부분만 반환
            result = generated_text[len(prompt):].strip()
            
            logger.info(f"화성 제안 생성 완료: {len(result)}자")
            return result
            
        except Exception as e:
            logger.error(f"화성 제안 생성 실패: {e}")
            return "화성 제안을 생성할 수 없습니다."
    
    def analyze_harmony_progression(self, progression: List[str]) -> Dict[str, Any]:
        """화성 진행 패턴 분석"""
        try:
            logger.info("화성 진행 패턴 분석 시작...")
            
            analysis = {
                "progression": progression,
                "length": len(progression),
                "patterns": [],
                "cadence_types": [],
                "modulation_indicators": [],
                "complexity_score": 0
            }
            
            # 기본 진행 패턴 인식
            common_patterns = [
                ["I", "V", "I"],
                ["I", "vi", "IV", "V"],
                ["ii", "V", "I"],
                ["I", "V", "vi", "IV"]
            ]
            
            for pattern in common_patterns:
                if self._contains_pattern(progression, pattern):
                    analysis["patterns"].append(pattern)
            
            # 종지 유형 분석
            if len(progression) >= 2:
                last_two = progression[-2:]
                if last_two == ["V", "I"]:
                    analysis["cadence_types"].append("Perfect Cadence")
                elif last_two == ["IV", "I"]:
                    analysis["cadence_types"].append("Plagal Cadence")
                elif last_two == ["V", "vi"]:
                    analysis["cadence_types"].append("Deceptive Cadence")
            
            # 전조 지표 분석
            modulation_indicators = ["bVI", "bVII", "bIII", "bVI"]
            for indicator in modulation_indicators:
                if any(indicator in chord for chord in progression):
                    analysis["modulation_indicators"].append(indicator)
            
            # 복잡도 점수 계산
            analysis["complexity_score"] = self._calculate_complexity(progression)
            
            logger.info("화성 진행 패턴 분석 완료")
            return analysis
            
        except Exception as e:
            logger.error(f"화성 진행 패턴 분석 실패: {e}")
            return {"error": str(e)}
    
    def _contains_pattern(self, progression: List[str], pattern: List[str]) -> bool:
        """진행에서 특정 패턴이 포함되어 있는지 확인"""
        if len(progression) < len(pattern):
            return False
        
        for i in range(len(progression) - len(pattern) + 1):
            if progression[i:i+len(pattern)] == pattern:
                return True
        return False
    
    def _calculate_complexity(self, progression: List[str]) -> float:
        """화성 진행의 복잡도 점수 계산"""
        complexity = 0.0
        
        # 길이에 따른 복잡도
        complexity += len(progression) * 0.1
        
        # 특수 화성에 따른 복잡도
        special_chords = ["7", "dim", "aug", "sus", "b", "#"]
        for chord in progression:
            for special in special_chords:
                if special in chord:
                    complexity += 0.5
        
        # 전조 지표에 따른 복잡도
        modulation_indicators = ["bVI", "bVII", "bIII", "bVI"]
        for indicator in modulation_indicators:
            if any(indicator in chord for chord in progression):
                complexity += 1.0
        
        return min(complexity, 10.0)  # 최대 10점
    
    def save_model(self, output_path: str) -> bool:
        """모델 저장"""
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch가 설치되지 않았습니다.")
        
        try:
            if self.model is None or self.tokenizer is None:
                raise ValueError("모델이 로드되지 않았습니다")
            
            # 출력 디렉토리 생성
            Path(output_path).mkdir(parents=True, exist_ok=True)
            
            # 모델 저장
            self.model.save_pretrained(output_path)
            self.tokenizer.save_pretrained(output_path)
            
            logger.info(f"모델 저장 완료: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"모델 저장 실패: {e}")
            return False
    
    def load_fine_tuned_model(self, model_path: str) -> bool:
        """파인튜닝된 모델 로드"""
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch가 설치되지 않았습니다.")
        
        try:
            logger.info(f"파인튜닝된 모델 로드 시작: {model_path}")
            
            if not Path(model_path).exists():
                raise FileNotFoundError(f"모델 경로가 존재하지 않습니다: {model_path}")
            
            # 토크나이저 로드
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # 모델 로드
            self.model = AutoModelForCausalLM.from_pretrained(
                model_path,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            
            # GPU로 이동
            if not torch.cuda.is_available():
                self.model = self.model.to(self.device)
            
            logger.info("파인튜닝된 모델 로드 완료")
            return True
            
        except Exception as e:
            logger.error(f"파인튜닝된 모델 로드 실패: {e}")
            return False
    
    def get_model_info(self) -> Dict[str, Any]:
        """모델 정보 반환"""
        if not TORCH_AVAILABLE:
            return {
                "status": "torch_not_available",
                "message": "PyTorch가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다."
            }
        
        if self.model is None:
            return {"status": "not_loaded"}
        
        return {
            "status": "loaded",
            "model_name": self.model_name,
            "device": str(self.device),
            "parameters": sum(p.numel() for p in self.model.parameters()),
            "trainable_parameters": sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        }
