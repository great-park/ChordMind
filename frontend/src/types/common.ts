// 공통 유틸리티 타입 정의

// 기본 타입
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 배열 타입
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
export type NonEmptyArray<T> = [T, ...T[]];

// 함수 타입
export type AsyncFunction<TArgs extends any[] = any[], TReturn = any> = (...args: TArgs) => Promise<TReturn>;
export type EventHandler<TEvent = Event> = (event: TEvent) => void;
export type ChangeHandler<TValue = string> = (value: TValue) => void;

// 객체 타입
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 유니온 타입
export type ValueOf<T> = T[keyof T];
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// 조건부 타입
export type If<T extends boolean, A, B> = T extends true ? A : B;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsAny<T> = 0 extends (1 & T) ? true : false;

// 문자열 타입
export type StringLiteral<T> = T extends string ? string extends T ? never : T : never;
export type TrimStart<T extends string> = T extends ` ${infer U}` ? TrimStart<U> : T;
export type TrimEnd<T extends string> = T extends `${infer U} ` ? TrimEnd<U> : T;
export type Trim<T extends string> = TrimStart<TrimEnd<T>>;

// 숫자 타입
export type NumberRange<T extends number, U extends number> = Exclude<number, Exclude<number, T | U>>;
export type IsPositive<T extends number> = T extends 0 ? false : T extends number ? T extends 0 ? false : true : false;

// 컴포넌트 Props 타입
export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never;
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// HTTP 타입
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type HTTPStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

// 이벤트 타입
export type Action<T = any> = { type: string; payload?: T };
export type Reducer<S, A extends Action> = (state: S, action: A) => S;
export type Dispatch<A extends Action> = (action: A) => void;

// DOM 이벤트 타입
export type KeyboardEvent = any;
export type MouseEvent = any;
export type ChangeEvent = any;
export type FormEvent = any;

// 스타일 타입
export type CSSProperties = any;
export type CSSValue = string | number;

// 테마 타입
export type Theme = 'light' | 'dark' | 'auto';
export type ColorScheme = 'light' | 'dark';
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// 애니메이션 타입
export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
export type AnimationState = 'idle' | 'running' | 'paused' | 'finished';

// 데이터 타입
export interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
  tag: string;
  link: string;
}

export interface Review {
  user: string;
  role: string;
  text: string;
  color: string;
}

export interface Keyword {
  text: string;
  rank?: number;
}

// 퀴즈 타입
export enum QuizType {
  CHORD_NAME = 'CHORD_NAME',
  SCALE_NAME = 'SCALE_NAME',
  SCALE = 'SCALE',
  INTERVAL = 'INTERVAL',
  RHYTHM = 'RHYTHM',
  THEORY = 'THEORY',
  PROGRESSION = 'PROGRESSION'
}
