'use client'

import { useState, useEffect } from 'react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  nickname: string;
  bio: string;
  location: string;
  website: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  joinDate: string;
  lastActive: string;
  profileImage?: string;
}

export default function ProfileInfo() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 임시 데이터 로드
    const mockProfile: UserProfile = {
      id: 1,
      name: '김음악',
      email: 'music@example.com',
      nickname: '음악사랑',
      bio: '피아노와 기타를 즐기는 음악 애호가입니다. AI와 함께하는 음악 학습을 통해 실력을 향상시키고 있습니다.',
      location: '서울시 강남구',
      website: 'https://musicblog.example.com',
      socialLinks: {
        twitter: '@musiclover',
        instagram: '@music_enthusiast',
        youtube: 'MusicChannel'
      },
      joinDate: '2024-01-01',
      lastActive: '2024-01-15T10:30:00Z'
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        socialLinks: {
          ...profile.socialLinks,
          [platform]: value
        }
      });
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

  if (!profile) {
    return (
      <div className="alert alert-warning" role="alert">
        프로필 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">프로필 정보</h5>
        <button
          className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              저장 중...
            </>
          ) : isEditing ? (
            <>
              <i className="bi bi-check-circle me-2"></i>
              저장
            </>
          ) : (
            <>
              <i className="bi bi-pencil me-2"></i>
              편집
            </>
          )}
        </button>
      </div>

      <div className="row">
        {/* 프로필 이미지 */}
        <div className="col-md-3 text-center mb-4">
          <div className="position-relative">
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3" 
                 style={{ width: '120px', height: '120px' }}>
              <i className="bi bi-person display-4 text-white"></i>
            </div>
            {isEditing && (
              <button className="btn btn-sm btn-outline-primary position-absolute bottom-0 end-0">
                <i className="bi bi-camera"></i>
              </button>
            )}
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="col-md-9">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">이름</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <p className="form-control-plaintext">{profile.name}</p>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">닉네임</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profile.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                />
              ) : (
                <p className="form-control-plaintext">{profile.nickname}</p>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">이메일</label>
              <p className="form-control-plaintext">{profile.email}</p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">위치</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <p className="form-control-plaintext">{profile.location}</p>
              )}
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">자기소개</label>
              {isEditing ? (
                <textarea
                  className="form-control"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              ) : (
                <p className="form-control-plaintext">{profile.bio}</p>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">웹사이트</label>
              {isEditing ? (
                <input
                  type="url"
                  className="form-control"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              ) : (
                <p className="form-control-plaintext">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  ) : '-'}
                </p>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">가입일</label>
              <p className="form-control-plaintext">
                {new Date(profile.joinDate).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>

          {/* 소셜 링크 */}
          <div className="mb-3">
            <label className="form-label">소셜 링크</label>
            <div className="row">
              <div className="col-md-4 mb-2">
                <label className="form-label small">Twitter</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profile.socialLinks.twitter || ''}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="@username"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profile.socialLinks.twitter || '-'}
                  </p>
                )}
              </div>
              <div className="col-md-4 mb-2">
                <label className="form-label small">Instagram</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profile.socialLinks.instagram || ''}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="@username"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profile.socialLinks.instagram || '-'}
                  </p>
                )}
              </div>
              <div className="col-md-4 mb-2">
                <label className="form-label small">YouTube</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profile.socialLinks.youtube || ''}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                    placeholder="Channel Name"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profile.socialLinks.youtube || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="mb-3">
            <label className="form-label">최근 활동</label>
            <p className="form-control-plaintext">
              {new Date(profile.lastActive).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            취소
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      )}
    </div>
  );
} 