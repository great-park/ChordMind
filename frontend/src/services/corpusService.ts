import { CorpusItem, CorpusStatistics, HarmonyAnalysis, CorpusSearchResult } from '../types/corpus';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class CorpusService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 코퍼스 스캔 및 데이터 로드
   */
  async scanCorpus(): Promise<{ success: boolean; message: string; statistics: CorpusStatistics }> {
    return this.request('/corpus/scan');
  }

  /**
   * 코퍼스 아이템 조회 (필터링 및 페이징 지원)
   */
  async getCorpusItems(
    genre?: string, 
    composer?: string, 
    page: number = 1, 
    size: number = 50
  ): Promise<{ success: boolean; items: CorpusItem[]; total: number; page: number; size: number; total_pages: number }> {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (composer) params.append('composer', composer);
    params.append('page', page.toString());
    params.append('size', size.toString());

    return this.request(`/corpus/items?${params.toString()}`);
  }

  /**
   * 코퍼스 통계 정보 조회
   */
  async getCorpusStatistics(): Promise<CorpusStatistics> {
    return this.request('/corpus/statistics');
  }

  /**
   * 악보 파일 처리 및 화성 분석
   */
  async processScore(scorePath: string): Promise<{
    success: boolean;
    analysis: HarmonyAnalysis;
    work_info: {
      composer: string;
      title: string;
      movement: string;
      time_signature: string;
      form: string;
      key_signature: string;
      total_measures: number;
    };
  }> {
    return this.request(`/corpus/process-score/${encodeURIComponent(scorePath)}`);
  }

  /**
   * 코퍼스 검색
   */
  async searchCorpus(query: string): Promise<{ success: boolean; results: CorpusItem[]; total: number }> {
    const params = new URLSearchParams({ query });
    return this.request(`/corpus/search?${params.toString()}`);
  }

  /**
   * 사용 가능한 장르 목록 조회
   */
  async getGenres(): Promise<string[]> {
    const response = await this.request<{ genres: string[]; total: number }>('/corpus/genres');
    return response.genres;
  }

  /**
   * 사용 가능한 작곡가 목록 조회
   */
  async getComposers(genre?: string): Promise<string[]> {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    
    const response = await this.request<{ composers: string[]; total: number; filtered_by_genre?: string }>(
      `/corpus/composers?${params.toString()}`
    );
    return response.composers;
  }

  /**
   * 코퍼스 데이터 내보내기
   */
  async exportCorpusData(format: 'json' | 'csv'): Promise<{ success: boolean; message: string; file_path: string }> {
    const params = new URLSearchParams({ format });
    return this.request(`/corpus/export?${params.toString()}`);
  }

  /**
   * 코퍼스 데이터 다운로드
   */
  async downloadCorpusData(format: 'json' | 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/corpus/download/${format}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Download failed! status: ${response.status}`);
    }

    return response.blob();
  }

  /**
   * 새로운 코퍼스 파일 업로드
   */
  async uploadCorpusFile(file: File, targetDirectory: string): Promise<{ success: boolean; message: string; file_path: string; file_size: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_directory', targetDirectory);

    const response = await fetch(`${API_BASE_URL}/corpus/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed! status: ${response.status}`);
    }

    return response.json();
  }

  // AI 모델 관련 API (PyTorch/Transformers가 설치되지 않은 경우 제한됨)

  /**
   * AI 모델 로드
   */
  async loadAIModel(): Promise<{ success: boolean; message: string; model_info?: any }> {
    try {
      return await this.request('/ai-model/load-model');
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }

  /**
   * 화성 진행 제안 생성
   */
  async generateHarmonySuggestion(
    context: string, 
    style: string = 'classical', 
    length: number = 4
  ): Promise<{ success: boolean; suggestions?: any }> {
    try {
      const params = new URLSearchParams({
        context,
        style,
        length: length.toString()
      });
      
      return await this.request(`/ai-model/generate-harmony-suggestion?${params.toString()}`, {
        method: 'POST'
      });
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }

  /**
   * 화성 진행 분석
   */
  async analyzeHarmonyProgression(progression: string): Promise<{ success: boolean; analysis?: any }> {
    try {
      const params = new URLSearchParams({ progression });
      
      return await this.request(`/ai-model/analyze-harmony-progression?${params.toString()}`, {
        method: 'POST'
      });
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }

  /**
   * 학습 데이터 준비
   */
  async prepareTrainingData(): Promise<{ success: boolean; message: string; training_data_info?: any }> {
    try {
      return await this.request('/ai-model/prepare-training-data', {
        method: 'POST'
      });
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }

  /**
   * 모델 파인튜닝 시작
   */
  async startModelTraining(): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request('/ai-model/start-training', {
        method: 'POST'
      });
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }

  /**
   * 학습 상태 조회
   */
  async getTrainingStatus(): Promise<{ success: boolean; training_status?: any }> {
    try {
      return await this.request('/ai-model/training-status');
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }

  /**
   * 사용 가능한 모델 목록
   */
  async getAvailableModels(): Promise<{ success: boolean; available_models?: any }> {
    try {
      return await this.request('/ai-model/available-models');
    } catch (error: any) {
      if (error.message.includes('PyTorch 및 Transformers가 설치되지 않아')) {
        return {
          success: false,
          message: 'AI 모델 기능을 사용하려면 PyTorch와 Transformers를 설치해야 합니다.'
        };
      }
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const corpusService = new CorpusService();
export default corpusService;
