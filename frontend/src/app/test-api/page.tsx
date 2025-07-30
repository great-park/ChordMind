'use client'

import { useState } from 'react';
import { feedbackService } from '../../services/feedbackService';
import { userService } from '../../services/userService';
import { practiceService } from '../../services/practiceService';

export default function TestAPI() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (service: string, endpoint: string, result: any) => {
    setResults(prev => [...prev, {
      service,
      endpoint,
      result,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testFeedbackAPI = async () => {
    setIsLoading(true);
    try {
      // 피드백 통계 조회
      const statsResult = await feedbackService.getFeedbackStats();
      addResult('Feedback Service', 'GET /stats', statsResult);

      // 최근 피드백 조회
      const recentResult = await feedbackService.getRecentFeedbacks(5);
      addResult('Feedback Service', 'GET /recent', recentResult);

    } catch (error) {
      addResult('Feedback Service', 'Error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testUserAPI = async () => {
    setIsLoading(true);
    try {
      // 사용자 프로필 조회 (테스트용 ID: 1)
      const profileResult = await userService.getUserProfile(1);
      addResult('User Service', 'GET /profile', profileResult);

      // 사용자 통계 조회
      const statsResult = await userService.getUserStats(1);
      addResult('User Service', 'GET /stats', statsResult);

    } catch (error) {
      addResult('User Service', 'Error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testPracticeAPI = async () => {
    setIsLoading(true);
    try {
      // 사용자 분석 요약 조회
      const summaryResult = await practiceService.getAnalyticsUserSummary(1);
      addResult('Practice Service', 'GET /analytics/summary', summaryResult);

      // 상위 사용자 조회
      const topUsersResult = await practiceService.getTopUsers(5);
      addResult('Practice Service', 'GET /leaderboard/top', topUsersResult);

    } catch (error) {
      addResult('Practice Service', 'Error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">API 테스트</h2>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100 mb-2"
                onClick={testFeedbackAPI}
                disabled={isLoading}
              >
                피드백 API 테스트
              </button>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success w-100 mb-2"
                onClick={testUserAPI}
                disabled={isLoading}
              >
                사용자 API 테스트
              </button>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-info w-100 mb-2"
                onClick={testPracticeAPI}
                disabled={isLoading}
              >
                연습 API 테스트
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>테스트 결과</h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={clearResults}>
              결과 지우기
            </button>
          </div>

          {isLoading && (
            <div className="text-center mb-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
            </div>
          )}

          <div className="row">
            {results.map((result, index) => (
              <div key={index} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <strong>{result.service}</strong> - {result.endpoint}
                    <small className="text-muted ms-2">{result.timestamp}</small>
                  </div>
                  <div className="card-body">
                    <pre className="mb-0" style={{ fontSize: '0.8rem', maxHeight: '200px', overflow: 'auto' }}>
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && !isLoading && (
            <div className="text-center text-muted">
              <p>테스트 버튼을 클릭하여 API를 테스트해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 