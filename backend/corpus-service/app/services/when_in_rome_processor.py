import logging
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
import json
import pandas as pd
import music21 as m21
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)

@dataclass
class WhenInRomeItem:
    """When-in-Rome 코퍼스 아이템 데이터 구조"""
    corpus: str  # e.g., "Piano_Sonatas", "OpenScore-LiederCorpus"
    composer: str
    work: str  # e.g., "Op027_No2(Moonlight)"
    movement: str  # e.g., "1", "2", "3"
    analysis_path: str
    score_path: Optional[str]
    metadata: Dict[str, Any]

@dataclass
class RomanNumeralAnalysis:
    """로마 숫자 분석 결과"""
    measure: int
    roman_numeral: str
    key: str
    inversion: Optional[str]
    secondary_dominant: Optional[str]
    modulation: Optional[str]
    form_section: Optional[str]

@dataclass
class WorkAnalysis:
    """작품 분석 결과"""
    composer: str
    title: str
    movement: str
    time_signature: str
    form: str
    key_signature: str
    analysis: List[RomanNumeralAnalysis]
    total_measures: int

class WhenInRomeProcessor:
    """When-in-Rome 코퍼스 데이터 처리기"""
    
    def __init__(self, corpus_base_path: str):
        self.corpus_base_path = Path(corpus_base_path)
        self.corpus_items: List[WhenInRomeItem] = []
        self.processed_data: Dict[str, Any] = {}
        
    def scan_corpus(self) -> List[WhenInRomeItem]:
        """When-in-Rome 코퍼스 디렉토리 스캔"""
        logger.info(f"When-in-Rome 코퍼스 스캔 시작: {self.corpus_base_path}")
        
        if not self.corpus_base_path.exists():
            logger.warning(f"코퍼스 경로가 존재하지 않습니다: {self.corpus_base_path}")
            return []
        
        corpus_items = []
        
        # 각 코퍼스 디렉토리 스캔
        for corpus_dir in self.corpus_base_path.iterdir():
            if not corpus_dir.is_dir() or corpus_dir.name.startswith('.'):
                continue
                
            corpus_name = corpus_dir.name
            logger.info(f"코퍼스 처리 중: {corpus_name}")
            
            # 코퍼스별 처리
            if corpus_name == "Piano_Sonatas":
                items = self._scan_piano_sonatas(corpus_dir, corpus_name)
            elif corpus_name == "OpenScore-LiederCorpus":
                items = self._scan_lieder_corpus(corpus_dir, corpus_name)
            elif corpus_name == "Quartets":
                items = self._scan_quartets(corpus_dir, corpus_name)
            else:
                items = self._scan_generic_corpus(corpus_dir, corpus_name)
            
            corpus_items.extend(items)
        
        self.corpus_items = corpus_items
        logger.info(f"코퍼스 스캔 완료: {len(corpus_items)}개 아이템 발견")
        return corpus_items
    
    def _scan_piano_sonatas(self, corpus_dir: Path, corpus_name: str) -> List[WhenInRomeItem]:
        """피아노 소나타 코퍼스 스캔"""
        items = []
        
        for composer_dir in corpus_dir.iterdir():
            if not composer_dir.is_dir():
                continue
                
            composer = composer_dir.name
            logger.debug(f"작곡가 처리 중: {composer}")
            
            for work_dir in composer_dir.iterdir():
                if not work_dir.is_dir():
                    continue
                    
                work = work_dir.name
                
                for movement_dir in work_dir.iterdir():
                    if not movement_dir.is_dir():
                        continue
                        
                    movement = movement_dir.name
                    
                    # 분석 파일 확인
                    analysis_file = movement_dir / "analysis.txt"
                    if not analysis_file.exists():
                        continue
                    
                    # 악보 파일 확인 (Working 디렉토리 내)
                    score_path = None
                    working_dir = movement_dir / "Working"
                    if working_dir.exists():
                        for file in working_dir.iterdir():
                            if file.suffix in ['.mxl', '.xml', '.mid', '.midi']:
                                score_path = str(file)
                                break
                    
                    # 메타데이터 수집
                    metadata = self._extract_metadata_from_analysis(analysis_file)
                    
                    item = WhenInRomeItem(
                        corpus=corpus_name,
                        composer=composer,
                        work=work,
                        movement=movement,
                        analysis_path=str(analysis_file),
                        score_path=score_path,
                        metadata=metadata
                    )
                    
                    items.append(item)
        
        return items
    
    def _scan_lieder_corpus(self, corpus_dir: Path, corpus_name: str) -> List[WhenInRomeItem]:
        """리더 코퍼스 스캔"""
        items = []
        
        for composer_dir in corpus_dir.iterdir():
            if not composer_dir.is_dir():
                continue
                
            composer = composer_dir.name
            logger.debug(f"작곡가 처리 중: {composer}")
            
            for work_dir in composer_dir.iterdir():
                if not work_dir.is_dir():
                    continue
                    
                work = work_dir.name
                
                # 리더는 보통 단일 곡이므로 movement는 "1"로 설정
                movement = "1"
                
                # 분석 파일 확인
                analysis_file = work_dir / "analysis.txt"
                if not analysis_file.exists():
                    continue
                
                # 악보 파일 확인
                score_path = None
                for file in work_dir.iterdir():
                    if file.suffix in ['.mxl', '.xml', '.mid', '.midi']:
                        score_path = str(file)
                        break
                
                # 메타데이터 수집
                metadata = self._extract_metadata_from_analysis(analysis_file)
                
                item = WhenInRomeItem(
                    corpus=corpus_name,
                    composer=composer,
                    work=work,
                    movement=movement,
                    analysis_path=str(analysis_file),
                    score_path=score_path,
                    metadata=metadata
                )
                
                items.append(item)
        
        return items
    
    def _scan_quartets(self, corpus_dir: Path, corpus_name: str) -> List[WhenInRomeItem]:
        """현악 4중주 코퍼스 스캔"""
        items = []
        
        for composer_dir in corpus_dir.iterdir():
            if not composer_dir.is_dir():
                continue
                
            composer = composer_dir.name
            logger.debug(f"작곡가 처리 중: {composer}")
            
            for work_dir in composer_dir.iterdir():
                if not work_dir.is_dir():
                    continue
                    
                work = work_dir.name
                
                for movement_dir in work_dir.iterdir():
                    if not movement_dir.is_dir():
                        continue
                        
                    movement = movement_dir.name
                    
                    # 분석 파일 확인
                    analysis_file = movement_dir / "analysis.txt"
                    if not analysis_file.exists():
                        continue
                    
                    # 악보 파일 확인
                    score_path = None
                    for file in movement_dir.iterdir():
                        if file.suffix in ['.mxl', '.xml', '.mid', '.midi']:
                            score_path = str(file)
                            break
                    
                    # 메타데이터 수집
                    metadata = self._extract_metadata_from_analysis(analysis_file)
                    
                    item = WhenInRomeItem(
                        corpus=corpus_name,
                        composer=composer,
                        work=work,
                        movement=movement,
                        analysis_path=str(analysis_file),
                        score_path=score_path,
                        metadata=metadata
                    )
                    
                    items.append(item)
        
        return items
    
    def _scan_generic_corpus(self, corpus_dir: Path, corpus_name: str) -> List[WhenInRomeItem]:
        """일반적인 코퍼스 스캔"""
        items = []
        
        # contents.tsv 파일이 있는지 확인
        contents_file = corpus_dir / f"{corpus_name}_contents.tsv"
        if contents_file.exists():
            logger.info(f"TSV 내용 파일 발견: {contents_file}")
            # TSV 파일을 읽어서 처리
            try:
                df = pd.read_csv(contents_file, sep='\t')
                logger.info(f"TSV 파일 로드 완료: {len(df)} 행")
                # TSV 내용을 기반으로 아이템 생성
                for _, row in df.iterrows():
                    # TSV 구조에 따라 처리
                    pass
            except Exception as e:
                logger.error(f"TSV 파일 처리 실패: {e}")
        
        return items
    
    def _extract_metadata_from_analysis(self, analysis_file: Path) -> Dict[str, Any]:
        """분석 파일에서 메타데이터 추출"""
        try:
            with open(analysis_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            metadata = {
                "title": "Unknown",
                "composer": "Unknown",
                "time_signature": "Unknown",
                "form": "Unknown",
                "key_signature": "Unknown",
                "total_measures": 0
            }
            
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                if line.startswith('Composer:'):
                    metadata["composer"] = line.split(':', 1)[1].strip()
                elif line.startswith('Title:'):
                    metadata["title"] = line.split(':', 1)[1].strip()
                elif line.startswith('Time signature:'):
                    metadata["time_signature"] = line.split(':', 1)[1].strip()
                elif line.startswith('Form:'):
                    metadata["form"] = line.split(':', 1)[1].strip()
                elif line.startswith('Key:'):
                    metadata["key_signature"] = line.split(':', 1)[1].strip()
                elif line.startswith('m') and ':' in line:
                    # 마디 정보에서 총 마디 수 추정
                    try:
                        measure_info = line.split(':', 1)[0]
                        measure_num = int(measure_info[1:])
                        metadata["total_measures"] = max(metadata["total_measures"], measure_num)
                    except:
                        pass
            
            return metadata
            
        except Exception as e:
            logger.error(f"메타데이터 추출 실패 {analysis_file}: {e}")
            return {
                "title": "Unknown",
                "composer": "Unknown",
                "time_signature": "Unknown",
                "form": "Unknown",
                "key_signature": "Unknown",
                "total_measures": 0
            }
    
    def parse_analysis_file(self, analysis_path: str) -> WorkAnalysis:
        """분석 파일 파싱"""
        try:
            with open(analysis_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            
            # 헤더 정보 추출
            composer = "Unknown"
            title = "Unknown"
            movement = "Unknown"
            time_signature = "Unknown"
            form = "Unknown"
            key_signature = "Unknown"
            
            analysis = []
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                if line.startswith('Composer:'):
                    composer = line.split(':', 1)[1].strip()
                elif line.startswith('Title:'):
                    title = line.split(':', 1)[1].strip()
                elif line.startswith('Movement:'):
                    movement = line.split(':', 1)[1].strip()
                elif line.startswith('Time signature:'):
                    time_signature = line.split(':', 1)[1].strip()
                elif line.startswith('Form:'):
                    form = line.split(':', 1)[1].strip()
                elif line.startswith('Key:'):
                    key_signature = line.split(':', 1)[1].strip()
                elif line.startswith('m') and ':' in line:
                    # 마디 분석 파싱
                    try:
                        measure_analysis = self._parse_measure_line(line)
                        if measure_analysis:
                            analysis.append(measure_analysis)
                    except Exception as e:
                        logger.debug(f"마디 파싱 실패: {line} - {e}")
            
            return WorkAnalysis(
                composer=composer,
                title=title,
                movement=movement,
                time_signature=time_signature,
                form=form,
                key_signature=key_signature,
                analysis=analysis,
                total_measures=len(analysis)
            )
            
        except Exception as e:
            logger.error(f"분석 파일 파싱 실패 {analysis_path}: {e}")
            raise
    
    def _parse_measure_line(self, line: str) -> Optional[RomanNumeralAnalysis]:
        """마디 라인 파싱"""
        try:
            # 예: "m1 c#: i" 또는 "m5 i" 또는 "m7 i b2 E: ii"
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
            inversion = None
            secondary_dominant = None
            modulation = None
            form_section = None
            
            for part in parts[1:]:
                if ':' in part:
                    # 키 정보 (예: "c#:", "E:")
                    key_part = part.rstrip(':')
                    if len(key_part) <= 3:  # 키는 보통 3자 이하
                        key = key_part
                elif part.startswith('b'):
                    # 인버전 정보 (예: "b2", "b6")
                    inversion = part
                elif part.startswith('V'):
                    # 보조 도미넌트
                    secondary_dominant = part
                elif part in ['i', 'I', 'ii', 'II', 'iii', 'III', 'iv', 'IV', 'v', 'V', 'vi', 'VI', 'vii', 'VII']:
                    # 로마 숫자
                    roman_numeral = part
                elif part in ['Exposition', 'Development', 'Recapitulation', 'Coda', 'Introduction']:
                    # 형식 섹션
                    form_section = part
            
            if not roman_numeral:
                return None
            
            return RomanNumeralAnalysis(
                measure=measure,
                roman_numeral=roman_numeral,
                key=key or "Unknown",
                inversion=inversion,
                secondary_dominant=secondary_dominant,
                modulation=modulation,
                form_section=form_section
            )
            
        except Exception as e:
            logger.debug(f"마디 라인 파싱 실패: {line} - {e}")
            return None
    
    def get_statistics(self) -> Dict[str, Any]:
        """코퍼스 통계 정보 반환"""
        if not self.corpus_items:
            return {}
        
        # 코퍼스별 통계
        corpus_stats = {}
        for item in self.corpus_items:
            if item.corpus not in corpus_stats:
                corpus_stats[item.corpus] = 0
            corpus_stats[item.corpus] += 1
        
        # 작곡가별 통계
        composer_stats = {}
        for item in self.corpus_items:
            if item.composer not in composer_stats:
                composer_stats[item.composer] = 0
            composer_stats[item.composer] += 1
        
        # 분석 파일 존재 여부 통계
        analysis_count = sum(1 for item in self.corpus_items if item.analysis_path)
        score_count = sum(1 for item in self.corpus_items if item.score_path)
        
        return {
            "total_items": len(self.corpus_items),
            "corpus_distribution": corpus_stats,
            "composer_distribution": composer_stats,
            "analysis_coverage": f"{analysis_count}/{len(self.corpus_items)} ({analysis_count/len(self.corpus_items)*100:.1f}%)",
            "score_coverage": f"{score_count}/{len(self.corpus_items)} ({score_count/len(self.corpus_items)*100:.1f}%)"
        }
    
    def export_to_json(self, output_path: str) -> bool:
        """처리된 데이터를 JSON으로 내보내기"""
        try:
            # 코퍼스 아이템들을 딕셔너리로 변환
            corpus_data = {
                "total_items": len(self.corpus_items),
                "corpus_items": [asdict(item) for item in self.corpus_items],
                "statistics": self.get_statistics()
            }
            
            # JSON 파일로 저장
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(corpus_data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"데이터 내보내기 완료: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"데이터 내보내기 실패: {e}")
            return False
    
    def export_to_csv(self, output_path: str) -> bool:
        """처리된 데이터를 CSV로 내보내기"""
        try:
            # DataFrame 생성
            data = []
            for item in self.corpus_items:
                data.append({
                    'corpus': item.corpus,
                    'composer': item.composer,
                    'work': item.work,
                    'movement': item.movement,
                    'analysis_path': item.analysis_path,
                    'score_path': item.score_path,
                    'title': item.metadata.get('title', ''),
                    'time_signature': item.metadata.get('time_signature', ''),
                    'form': item.metadata.get('form', ''),
                    'key_signature': item.metadata.get('key_signature', ''),
                    'total_measures': item.metadata.get('total_measures', 0)
                })
            
            df = pd.DataFrame(data)
            df.to_csv(output_path, index=False, encoding='utf-8')
            
            logger.info(f"CSV 내보내기 완료: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"CSV 내보내기 실패: {e}")
            return False
