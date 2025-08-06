'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

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
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await userService.getUserProfile(user.id);
        
        if (response.success && response.data) {
          setProfile({
            ...response.data,
            bio: response.data.bio || '',
            location: response.data.location || '',
            website: response.data.website || '',
            socialLinks: response.data.socialLinks || {},
            profileImage: response.data.profileImage
          });
        } else {
          setError(response.message || '프로필을 불러오지 못했습니다.');
        }
      } catch (error) {
        setError('프로필을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!profile || !user?.id) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const updateRequest = {
        name: profile.name,
        nickname: profile.nickname,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        socialLinks: profile.socialLinks,
        profileImage: profile.profileImage
      };
      
      const response = await userService.updateUserProfile(user.id, updateRequest);
      
      if (response.success && response.data) {
        setProfile(response.data);
        setIsEditing(false);
      } else {
        setError(response.message || '프로필 저장에 실패했습니다.');
      }
    } catch (error) {
      setError('프로필 저장 중 오류가 발생했습니다.');
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

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning" role="alert">
        로그인이 필요합니다.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
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