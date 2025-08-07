'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.nickname || undefined
    );
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="container-fluid" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-music-note-beamed display-4 text-primary"></i>
                </div>
                <h2 className="fw-bold">ChordMind</h2>
                <p className="text-muted">AI와 함께하는 음악 여정을 시작하세요!</p>
                <div className="d-flex justify-content-center gap-3 mb-3">
                  <div className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                    <i className="bi bi-cpu me-1"></i>AI 분석
                  </div>
                  <div className="badge bg-success bg-opacity-10 text-success px-2 py-1">
                    <i className="bi bi-graph-up me-1"></i>실시간 피드백
                  </div>
                  <div className="badge bg-info bg-opacity-10 text-info px-2 py-1">
                    <i className="bi bi-people me-1"></i>커뮤니티
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">이름 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">이메일 *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="nickname" className="form-label">닉네임</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="선택사항"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">비밀번호 *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">비밀번호 확인 *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3 py-3"
                  disabled={isLoading}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      가입 중...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-rocket-takeoff me-2"></i>
                      무료로 시작하기
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-muted small mb-2">
                    가입하시면 <a href="#" className="text-decoration-none">이용약관</a> 및 <a href="#" className="text-decoration-none">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
                  </p>
                  <a href="/login" className="text-decoration-none">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    이미 계정이 있으신가요? 로그인
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 