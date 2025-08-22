import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
import json
import pandas as pd
import music21 as m21
from .when_in_rome_processor import WhenInRomeProcessor, WhenInRomeItem, WorkAnalysis

logger = logging.getLogger(__name__)

class CorpusItem:
    """코퍼스 아이템 데이터 구조 (기존 API 호환성 유지)"""
    def __init__(self, when_in_rome_item: WhenInRomeItem):
        self.genre = when_in_rome_item.corpus
        self.composer = when_in_rome_item.composer
        self.set = when_in_rome_item.work
        self.movement = when_in_rome_item.movement
        self.score_path = when_in_rome_item.score_path
        self.analysis_path = when_in_rome_item.analysis_path
        self.auto_analysis_path = None  # 자동 분석 파일 경로
        self.metadata = when_in_rome_item.metadata

class HarmonyAnalysis:
    """화성 분석 결과 (기존 API 호환성 유지)"""
    def __init__(self, work_analysis: WorkAnalysis):
        self.roman_numerals = [analysis.roman_numeral for analysis in work_analysis.analysis]
        self.chord_progressions = [f"{analysis.key}:{analysis.roman_numeral}" for analysis in work_analysis.analysis if analysis.key != "Unknown"]
        self.cadences = []
        self.modulations = []
        self.form_sections = []
        
        # 종지 패턴 감지
        for i, analysis in enumerate(work_analysis.analysis):
            if i > 0:
                prev_analysis = work_analysis.analysis[i-1]
                # V-I 진행 감지
                if prev_analysis.roman_numeral in ['V', 'v'] and analysis.roman_numeral in ['I', 'i']:
                    self.cadences.append(f"V-I (m{prev_analysis.measure}-{analysis.measure})")
                # IV-I 진행 감지
                elif prev_analysis.roman_numeral in ['IV', 'iv'] and analysis.roman_numeral in ['I', 'i']:
                    self.cadences.append(f"IV-I (m{prev_analysis.measure}-{analysis.measure})")
            
            # 조성 변화 감지
            if analysis.key != "Unknown" and analysis.key != work_analysis.key_signature:
                self.modulations.append(f"m{analysis.measure}: {analysis.key}")
            
            # 형식 섹션
            if analysis.form_section:
                self.form_sections.append(f"m{analysis.measure}: {analysis.form_section}")

class CorpusProcessor:
    """코퍼스 데이터 처리기 (When-in-Rome 통합)"""
    
    def __init__(self, corpus_base_path: str):
        self.corpus_base_path = Path(corpus_base_path)
        self.when_in_rome_processor = WhenInRomeProcessor(corpus_base_path)
        self.corpus_items: List[CorpusItem] = []
        
    def scan_corpus(self) -> Dict[str, Any]:
        """코퍼스 스캔 및 데이터 로드"""
        logger.info("When-in-Rome 코퍼스 스캔 시작")
        
        try:
            # When-in-Rome 프로세서로 코퍼스 스캔
            when_in_rome_items = self.when_in_rome_processor.scan_corpus()
            
            # 기존 API 호환성을 위해 CorpusItem으로 변환
            self.corpus_items = [CorpusItem(item) for item in when_in_rome_items]
            
            # 통계 정보 생성
            statistics = self._generate_statistics()
            
            logger.info(f"코퍼스 스캔 완료: {len(self.corpus_items)}개 아이템")
            return {
                "success": True,
                "message": f"코퍼스 스캔 완료: {len(self.corpus_items)}개 아이템",
                "statistics": statistics
            }
            
        except Exception as e:
            logger.error(f"코퍼스 스캔 실패: {e}")
            return {
                "success": False,
                "message": f"코퍼스 스캔 실패: {str(e)}",
                "statistics": {}
            }
    
    def get_corpus_items(self, genre: str = None, composer: str = None) -> Dict[str, Any]:
        """코퍼스 아이템 조회 (필터링 지원)"""
        try:
            filtered_items = self.corpus_items
            
            if genre:
                filtered_items = [item for item in filtered_items if item.genre == genre]
            
            if composer:
                filtered_items = [item for item in filtered_items if item.composer == composer]
            
            return {
                "success": True,
                "items": filtered_items,
                "total": len(filtered_items)
            }
            
        except Exception as e:
            logger.error(f"코퍼스 아이템 조회 실패: {e}")
            return {
                "success": False,
                "message": f"코퍼스 아이템 조회 실패: {str(e)}",
                "items": [],
                "total": 0
            }
    
    def get_corpus_statistics(self) -> Dict[str, Any]:
        """코퍼스 통계 정보 반환"""
        try:
            return {
                "success": True,
                "statistics": self._generate_statistics()
            }
        except Exception as e:
            logger.error(f"통계 정보 조회 실패: {e}")
            return {
                "success": False,
                "message": f"통계 정보 조회 실패: {str(e)}",
                "statistics": {}
            }
    
    def process_score(self, score_path: str) -> Dict[str, Any]:
        """악보 파일 처리 및 화성 분석"""
        try:
            # 해당 악보의 분석 파일 찾기
            analysis_file = self._find_analysis_file(score_path)
            if not analysis_file:
                return {
                    "success": False,
                    "message": "해당 악보의 분석 파일을 찾을 수 없습니다."
                }
            
            # When-in-Rome 프로세서로 분석 파일 파싱
            work_analysis = self.when_in_rome_processor.parse_analysis_file(analysis_file)
            
            # 기존 API 호환성을 위해 HarmonyAnalysis로 변환
            harmony_analysis = HarmonyAnalysis(work_analysis)
            
            return {
                "success": True,
                "analysis": harmony_analysis,
                "work_info": {
                    "composer": work_analysis.composer,
                    "title": work_analysis.title,
                    "movement": work_analysis.movement,
                    "time_signature": work_analysis.time_signature,
                    "form": work_analysis.form,
                    "key_signature": work_analysis.key_signature,
                    "total_measures": work_analysis.total_measures
                }
            }
            
        except Exception as e:
            logger.error(f"악보 처리 실패: {e}")
            return {
                "success": False,
                "message": f"악보 처리 실패: {str(e)}"
            }
    
    def search_corpus(self, query: str) -> Dict[str, Any]:
        """코퍼스 검색"""
        try:
            query_lower = query.lower()
            results = []
            
            for item in self.corpus_items:
                # 제목, 작곡가, 장르에서 검색
                if (query_lower in item.metadata.get('title', '').lower() or
                    query_lower in item.composer.lower() or
                    query_lower in item.genre.lower()):
                    results.append(item)
            
            return {
                "success": True,
                "results": results,
                "total": len(results)
            }
            
        except Exception as e:
            logger.error(f"코퍼스 검색 실패: {e}")
            return {
                "success": False,
                "message": f"코퍼스 검색 실패: {str(e)}",
                "results": [],
                "total": 0
            }
    
    def get_genres(self) -> List[str]:
        """사용 가능한 장르 목록 반환"""
        try:
            genres = list(set(item.genre for item in self.corpus_items))
            return sorted(genres)
        except Exception as e:
            logger.error(f"장르 목록 조회 실패: {e}")
            return []
    
    def get_composers(self, genre: str = None) -> List[str]:
        """사용 가능한 작곡가 목록 반환"""
        try:
            composers = []
            for item in self.corpus_items:
                if not genre or item.genre == genre:
                    composers.append(item.composer)
            
            return sorted(list(set(composers)))
        except Exception as e:
            logger.error(f"작곡가 목록 조회 실패: {e}")
            return []
    
    def export_corpus_data(self, format: str = 'json') -> Dict[str, Any]:
        """코퍼스 데이터 내보내기"""
        try:
            if format == 'json':
                output_path = f"corpus_export_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.json"
                success = self.when_in_rome_processor.export_to_json(output_path)
            elif format == 'csv':
                output_path = f"corpus_export_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.csv"
                success = self.when_in_rome_processor.export_to_csv(output_path)
            else:
                return {
                    "success": False,
                    "message": f"지원하지 않는 형식: {format}"
                }
            
            if success:
                return {
                    "success": True,
                    "message": f"{format.upper()} 내보내기 완료",
                    "file_path": output_path
                }
            else:
                return {
                    "success": False,
                    "message": f"{format.upper()} 내보내기 실패"
                }
                
        except Exception as e:
            logger.error(f"데이터 내보내기 실패: {e}")
            return {
                "success": False,
                "message": f"데이터 내보내기 실패: {str(e)}"
            }
    
    def _generate_statistics(self) -> Dict[str, Any]:
        """통계 정보 생성"""
        if not self.corpus_items:
            return {}
        
        # 장르별 통계
        genre_distribution = {}
        for item in self.corpus_items:
            if item.genre not in genre_distribution:
                genre_distribution[item.genre] = 0
            genre_distribution[item.genre] += 1
        
        # 작곡가별 통계
        composer_distribution = {}
        for item in self.corpus_items:
            if item.composer not in composer_distribution:
                composer_distribution[item.composer] = 0
            composer_distribution[item.composer] += 1
        
        # 분석 파일 존재 여부 통계
        manual_analysis_count = sum(1 for item in self.corpus_items if item.analysis_path)
        score_count = sum(1 for item in self.corpus_items if item.score_path)
        
        return {
            "total_items": len(self.corpus_items),
            "genre_distribution": genre_distribution,
            "composer_distribution": composer_distribution,
            "manual_analysis_count": manual_analysis_count,
            "score_count": score_count,
            "analysis_coverage": f"{manual_analysis_count}/{len(self.corpus_items)} ({manual_analysis_count/len(self.corpus_items)*100:.1f}%)"
        }
    
    def _find_analysis_file(self, score_path: str) -> Optional[str]:
        """악보 파일에 해당하는 분석 파일 찾기"""
        try:
            score_path_obj = Path(score_path)
            
            # 악보 파일이 Working 디렉토리에 있는 경우
            if "Working" in str(score_path_obj):
                # Working 디렉토리의 상위 디렉토리에서 analysis.txt 찾기
                analysis_file = score_path_obj.parent.parent / "analysis.txt"
                if analysis_file.exists():
                    return str(analysis_file)
            
            # 악보 파일과 같은 디렉토리에서 analysis.txt 찾기
            analysis_file = score_path_obj.parent / "analysis.txt"
            if analysis_file.exists():
                return str(analysis_file)
            
            return None
            
        except Exception as e:
            logger.error(f"분석 파일 찾기 실패: {e}")
            return None
