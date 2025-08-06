'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export default function ProfileSettings() {
  const { user, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      practice: true,
      achievements: true,
      weekly: false
    },
    privacy: {
      profileVisible: true,
      practiceHistory: true,
      achievements: true,
      leaderboard: true
    },
    learning: {
      difficulty: 'INTERMEDIATE',
      focusAreas: ['박자 정확도', '음정 정확도'],
      dailyGoal: 30,
      autoAnalysis: true
    },
    theme: {
      mode: 'light',
      color: 'blue'
    }
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await userService.getUserSettings(user.id);
        
        if (response.success && response.data) {
          setSettings(response.data);
        } else {
          setError(response.message || '설정을 불러오지 못했습니다.');
        }
      } catch (error) {
        setError('설정을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await userService.updateUserSettings(user.id, settings);
      
      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        setError(response.message || '설정 저장에 실패했습니다.');
      }
    } catch (error) {
      setError('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning" role="alert">
        로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">설정</h5>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              저장 중...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              저장
            </>
          )}
        </button>
      </div>

      {/* 알림 설정 */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">알림 설정</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.notifications.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="emailNotifications">
                  이메일 알림
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pushNotifications"
                  checked={settings.notifications.push}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="pushNotifications">
                  푸시 알림
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="practiceNotifications"
                  checked={settings.notifications.practice}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, practice: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="practiceNotifications">
                  연습 알림
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="achievementNotifications"
                  checked={settings.notifications.achievements}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, achievements: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="achievementNotifications">
                  업적 알림
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 개인정보 설정 */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">개인정보 설정</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="profileVisible"
                  checked={settings.privacy.profileVisible}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, profileVisible: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="profileVisible">
                  프로필 공개
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="practiceHistory"
                  checked={settings.privacy.practiceHistory}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, practiceHistory: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="practiceHistory">
                  연습 기록 공개
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="achievements"
                  checked={settings.privacy.achievements}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, achievements: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="achievements">
                  업적 공개
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="leaderboard"
                  checked={settings.privacy.leaderboard}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, leaderboard: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="leaderboard">
                  리더보드 참여
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 학습 설정 */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">학습 설정</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">기본 난이도</label>
              <select
                className="form-select"
                value={settings.learning.difficulty}
                onChange={(e) => setSettings({
                  ...settings,
                  learning: { ...settings.learning, difficulty: e.target.value }
                })}
              >
                <option value="BEGINNER">초급</option>
                <option value="INTERMEDIATE">중급</option>
                <option value="ADVANCED">고급</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">일일 목표 시간 (분)</label>
              <input
                type="number"
                className="form-control"
                value={settings.learning.dailyGoal}
                onChange={(e) => setSettings({
                  ...settings,
                  learning: { ...settings.learning, dailyGoal: parseInt(e.target.value) }
                })}
                min="10"
                max="120"
              />
            </div>
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoAnalysis"
                  checked={settings.learning.autoAnalysis}
                  onChange={(e) => setSettings({
                    ...settings,
                    learning: { ...settings.learning, autoAnalysis: e.target.checked }
                  })}
                />
                <label className="form-check-label" htmlFor="autoAnalysis">
                  자동 분석 활성화
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 테마 설정 */}
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">테마 설정</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">테마 모드</label>
              <select
                className="form-select"
                value={settings.theme.mode}
                onChange={(e) => setSettings({
                  ...settings,
                  theme: { ...settings.theme, mode: e.target.value }
                })}
              >
                <option value="light">라이트 모드</option>
                <option value="dark">다크 모드</option>
                <option value="auto">시스템 설정</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">색상 테마</label>
              <select
                className="form-select"
                value={settings.theme.color}
                onChange={(e) => setSettings({
                  ...settings,
                  theme: { ...settings.theme, color: e.target.value }
                })}
              >
                <option value="blue">파란색</option>
                <option value="green">초록색</option>
                <option value="purple">보라색</option>
                <option value="orange">주황색</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 