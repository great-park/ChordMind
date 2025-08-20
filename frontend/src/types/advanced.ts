// TypeScript 5.5+ 최신 기능 활용

// 1. const type parameters (TypeScript 5.0+)
export type ConstArray<T extends readonly unknown[]> = readonly [...T];

// 2. satisfies operator 활용
export const PRACTICE_TYPES = ['scale', 'chord', 'song', 'theory'] as const;
export type PracticeType = (typeof PRACTICE_TYPES)[number];

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// 3. Template literal types
export type ColorVariant = 'primary' | 'success' | 'warning' | 'info';
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant = `${ColorVariant}-${SizeVariant}`;

// 4. Conditional types with infer
export type ExtractArrayType<T> = T extends readonly (infer U)[] ? U : never;
export type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;

// 5. Mapped types with template literals
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
};

// 6. Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 7. Branded types for type safety
export type UserId = number & { readonly __brand: 'UserId' };
export type SessionId = string & { readonly __brand: 'SessionId' };
export type Score = number & { readonly __brand: 'Score' };

// 8. Function types with constraints
export type EventHandler<T extends Event = Event> = (event: T) => void;
export type AsyncEventHandler<T extends Event = Event> = (event: T) => Promise<void>;

// 9. Union types with discriminators
export type PracticeEvent = 
  | { type: 'start'; sessionId: SessionId; timestamp: Date }
  | { type: 'pause'; sessionId: SessionId; timestamp: Date }
  | { type: 'resume'; sessionId: SessionId; timestamp: Date }
  | { type: 'complete'; sessionId: SessionId; score: Score; timestamp: Date };

// 10. Recursive types
export type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};

export type PracticeGoal = {
  id: string;
  title: string;
  description?: string;
  targetScore: Score;
  deadline: Date;
  subGoals?: PracticeGoal[];
};

// 11. Intersection types with constraints
export type WithId = { id: string | number };
export type WithTimestamps = { createdAt: Date; updatedAt: Date };
export type WithAudit = WithId & WithTimestamps;

// 12. Conditional types for API responses
export type ApiResult<T> = ApiResponse<T> | ApiError;

// 13. Type guards
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true;
}

export function isApiError<T>(result: ApiResult<T>): result is ApiError {
  return result.success === false;
}

// 14. Generic constraints with keyof
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// 15. Advanced utility types
export type AsyncReturnType<T extends (...args: any) => any> = 
  T extends (...args: any) => Promise<infer R> ? R : any;

export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// 16. Type-safe event emitters
export type EventMap = {
  'practice:start': { sessionId: SessionId; type: PracticeType };
  'practice:end': { sessionId: SessionId; score: Score };
  'goal:achieved': { goalId: string; score: Score };
  'user:login': { userId: UserId; username: string };
  'user:logout': { userId: UserId };
};

export type EventName = keyof EventMap;
export type EventPayload<T extends EventName> = EventMap[T];

// 17. Component props with default values
export type ComponentProps<T extends React.ComponentType<any>> = 
  T extends React.ComponentType<infer P> ? P : never;

// 18. Hook return types
export type HookReturn<T> = T extends (...args: any[]) => infer R ? R : never;

// 19. Form validation schemas
export type ValidationRule<T> = {
  required?: boolean;
  min?: T extends string ? number : T extends number ? number : never;
  max?: T extends string ? number : T extends number ? number : never;
  pattern?: T extends string ? RegExp : never;
  custom?: (value: T) => boolean | string;
};

export type FormSchema<T> = {
  [K in keyof T]: ValidationRule<T[K]>;
};

// 20. State management types
export type StateSelector<T, R> = (state: T) => R;
export type StateUpdater<T> = (state: T) => T;
export type StateAction<T> = T | StateUpdater<T>;
