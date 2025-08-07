'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
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
                <p className="text-muted">다시 만나서 반가워요! 🎵</p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    이메일
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      로그인
                    </>
                  )}
                </button>

                <div className="text-center">
                  <a href="/register" className="text-decoration-none btn btn-outline-primary w-100 py-2">
                    <i className="bi bi-person-plus me-2"></i>
                    계정이 없으신가요? 무료로 시작하기
                  </a>
                </div>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-3">소셜 로그인</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-dark" disabled>
                    <i className="bi bi-google me-2"></i>
                    Google로 로그인
                  </button>
                  <button className="btn btn-outline-dark" disabled>
                    <i className="bi bi-apple me-2"></i>
                    Apple로 로그인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 