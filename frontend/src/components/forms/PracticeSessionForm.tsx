import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../stores/useAppStore';
import { PracticeType, DifficultyLevel } from '../../types/practice';
import { ApiResult } from '../../types/api';
import { FORM_STYLES, CARD_STYLES } from '../../constants/styles';

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
    <div className="card border-0 shadow-lg" style={CARD_STYLES.form}>
      <div className="card-body p-4">
        <h4 className="card-title mb-4" style={{ color: 'white' }}>
          <i className="bi bi-music-note-beamed me-2"></i>
          연습 세션 시작
        </h4>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* 연습 유형 선택 */}
          <div className="mb-3">
            <label className="form-label fw-bold" style={FORM_STYLES.label}>
              연습 유형
            </label>
            <select
              {...register('type')}
              className="form-select"
              style={FORM_STYLES.input}
            >
              <option value="scale">스케일</option>
              <option value="chord">코드</option>
              <option value="song">곡</option>
              <option value="theory">이론</option>
            </select>
            {errors.type && (
              <div className="invalid-feedback d-block" style={FORM_STYLES.error}>
                {errors.type.message}
              </div>
            )}
          </div>

          {/* 난이도 선택 */}
          <div className="mb-3">
            <label className="form-label fw-bold" style={FORM_STYLES.label}>
              난이도
            </label>
            <select
              {...register('difficulty')}
              className="form-select"
              style={FORM_STYLES.input}
            >
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">고급</option>
            </select>
            {errors.difficulty && (
              <div className="invalid-feedback d-block" style={FORM_STYLES.error}>
                {errors.difficulty.message}
              </div>
            )}
          </div>

          {/* 연습 시간 */}
          <div className="mb-3">
            <label className="form-label fw-bold" style={FORM_STYLES.label}>
              연습 시간 (분)
            </label>
            <input
              type="number"
              {...register('duration', { valueAsNumber: true })}
              className="form-control"
              min="5"
              max="120"
              style={FORM_STYLES.input}
            />
            {errors.duration && (
              <div className="invalid-feedback d-block" style={FORM_STYLES.error}>
                {errors.duration.message}
              </div>
            )}
            <small className="form-text" style={FORM_STYLES.helpText}>
              5분에서 120분 사이로 설정해주세요
            </small>
          </div>

          {/* 메모 */}
          <div className="mb-3">
            <label className="form-label fw-bold" style={FORM_STYLES.label}>
              메모 (선택사항)
            </label>
            <textarea
              {...register('notes')}
              className="form-control"
              rows={3}
              placeholder="오늘의 연습 목표나 특별한 노트를 작성해주세요"
              style={FORM_STYLES.input}
            />
            {errors.notes && (
              <div className="invalid-feedback d-block" style={FORM_STYLES.error}>
                {errors.notes.message}
              </div>
            )}
          </div>

          {/* 목표 */}
          <div className="mb-4">
            <label className="form-label fw-bold" style={FORM_STYLES.label}>
              목표 (선택사항)
            </label>
            <input
              type="text"
              {...register('goal')}
              className="form-control"
              placeholder="이번 연습에서 달성하고 싶은 목표"
              style={FORM_STYLES.input}
            />
            {errors.goal && (
              <div className="invalid-feedback d-block" style={FORM_STYLES.error}>
                {errors.goal.message}
              </div>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="d-flex gap-3">
            <button
              type="submit"
              className="btn btn-primary flex-grow-1"
              disabled={isSubmitting}
              style={{
                background: '#8b5cf6',
                border: 'none',
                padding: '12px 24px'
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
                className="btn btn-outline-secondary"
                onClick={onCancel}
                style={{
                  border: '2px solid #6b7280',
                  color: '#9ca3af',
                  padding: '12px 24px'
                }}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
});

PracticeSessionForm.displayName = 'PracticeSessionForm';

export default PracticeSessionForm;
