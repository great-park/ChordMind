import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../stores/useAppStore';
import { PracticeType, DifficultyLevel, type ApiResult } from '../../types/advanced';

// 폼 스키마 정의 - satisfies operator 활용
const practiceSessionSchema = z.object({
  type: z.enum(['scale', 'chord', 'song', 'theory'] as const),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'] as const),
  duration: z.number().min(5).max(120),
  notes: z.string().max(500).optional(),
  goal: z.string().max(200).optional(),
}) satisfies z.ZodSchema;

type PracticeSessionFormData = z.infer<typeof practiceSessionSchema>;

interface PracticeSessionFormProps {
  onSubmit?: (data: PracticeSessionFormData) => Promise<ApiResult<void>>;
  onCancel?: () => void;
}

const PracticeSessionForm: React.FC<PracticeSessionFormProps> = React.memo(({
  onSubmit,
  onCancel
}) => {
  const startPracticeSession = useAppStore((state) => state.startPracticeSession);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PracticeSessionFormData>({
    resolver: zodResolver(practiceSessionSchema),
    defaultValues: {
      type: 'scale',
      difficulty: 'beginner',
      duration: 30,
    },
  });

  const handleFormSubmit = async (data: PracticeSessionFormData) => {
    try {
      // Zustand 스토어에 연습 세션 시작
      startPracticeSession(data.type);
      
      // 부모 컴포넌트에 데이터 전달
      if (onSubmit) {
        const result = await onSubmit(data);
        if (result.success) {
          reset();
        }
      } else {
        reset();
      }
    } catch (error) {
      console.error('연습 세션 시작 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 연습 유형 선택 */}
      <div>
        <label className="form-label fw-bold" style={{color: 'white'}}>
          연습 유형 <span className="text-danger">*</span>
        </label>
        <select
          {...register('type')}
          className={`form-select ${errors.type ? 'is-invalid' : ''}`}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '8px'
          }}
        >
          <option value="scale">스케일 연습</option>
          <option value="chord">코드 연습</option>
          <option value="song">곡 연습</option>
          <option value="theory">이론 학습</option>
        </select>
        {errors.type && (
          <div className="invalid-feedback d-block" style={{color: '#fca5a5'}}>
            {errors.type.message}
          </div>
        )}
      </div>

      {/* 난이도 선택 */}
      <div>
        <label className="form-label fw-bold" style={{color: 'white'}}>
          난이도 <span className="text-danger">*</span>
        </label>
        <select
          {...register('difficulty')}
          className={`form-select ${errors.difficulty ? 'is-invalid' : ''}`}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '8px'
          }}
        >
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>
        {errors.difficulty && (
          <div className="invalid-feedback d-block" style={{color: '#fca5a5'}}>
            {errors.difficulty.message}
          </div>
        )}
      </div>

      {/* 연습 시간 */}
      <div>
        <label className="form-label fw-bold" style={{color: 'white'}}>
          연습 시간 (분) <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          {...register('duration', { valueAsNumber: true })}
          className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
          min="5"
          max="120"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '8px'
          }}
        />
        {errors.duration && (
          <div className="invalid-feedback d-block" style={{color: '#fca5a5'}}>
            {errors.duration.message}
          </div>
        )}
        <small className="form-text" style={{color: '#cbd5e1'}}>
          5분에서 120분 사이로 설정해주세요
        </small>
      </div>

      {/* 목표 설정 */}
      <div>
        <label className="form-label fw-bold" style={{color: 'white'}}>
          연습 목표
        </label>
        <textarea
          {...register('goal')}
          className="form-control"
          rows={2}
          placeholder="이번 연습에서 달성하고 싶은 목표를 입력하세요"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '8px'
          }}
        />
        {errors.goal && (
          <div className="invalid-feedback d-block" style={{color: '#fca5a5'}}>
            {errors.goal.message}
          </div>
        )}
      </div>

      {/* 메모 */}
      <div>
        <label className="form-label fw-bold" style={{color: 'white'}}>
          메모
        </label>
        <textarea
          {...register('notes')}
          className="form-control"
          rows={3}
          placeholder="연습에 대한 추가 메모를 입력하세요"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '8px'
          }}
        />
        {errors.notes && (
          <div className="invalid-feedback d-block" style={{color: '#fca5a5'}}>
            {errors.notes.message}
          </div>
        )}
      </div>

      {/* 버튼 그룹 */}
      <div className="d-flex gap-3 pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn px-4 py-2 fw-bold"
          style={{
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            flex: 1
          }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              시작 중...
            </>
          ) : (
            <>
              <i className="bi bi-play-circle me-2"></i>
              연습 시작
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline-secondary px-4 py-2"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              flex: 1
            }}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
});

PracticeSessionForm.displayName = 'PracticeSessionForm';

export default PracticeSessionForm;
