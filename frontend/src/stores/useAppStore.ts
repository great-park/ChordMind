import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface PracticeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'scale' | 'chord' | 'song' | 'theory';
  score?: number;
}

interface AppState {
  // 사용자 정보
  user: User | null;
  isAuthenticated: boolean;
  
  // UI 상태
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  
  // 연습 관련 상태
  currentPracticeSession: PracticeSession | null;
  practiceHistory: PracticeSession[];
  
  // 설정
  settings: {
    notifications: boolean;
    autoSave: boolean;
    practiceReminders: boolean;
  };
}

interface AppActions {
  // 사용자 관련 액션
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  
  // UI 관련 액션
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ko' | 'en') => void;
  
  // 연습 관련 액션
  startPracticeSession: (type: PracticeSession['type']) => void;
  endPracticeSession: (score?: number) => void;
  addPracticeSession: (session: PracticeSession) => void;
  
  // 설정 관련 액션
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  resetSettings: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  sidebarOpen: true,
  theme: 'dark',
  language: 'ko',
  currentPracticeSession: null,
  practiceHistory: [],
  settings: {
    notifications: true,
    autoSave: true,
    practiceReminders: true,
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // 사용자 관련 액션
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        
        // UI 관련 액션
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        
        // 연습 관련 액션
        startPracticeSession: (type) => {
          const session: PracticeSession = {
            id: Date.now().toString(),
            startTime: new Date(),
            type,
            duration: 0,
          };
          set({ currentPracticeSession: session });
        },
        
        endPracticeSession: (score) => {
          const { currentPracticeSession } = get();
          if (currentPracticeSession) {
            const endTime = new Date();
            const duration = endTime.getTime() - currentPracticeSession.startTime.getTime();
            
            const completedSession: PracticeSession = {
              ...currentPracticeSession,
              endTime,
              duration,
              score,
            };
            
            set((state) => ({
              currentPracticeSession: null,
              practiceHistory: [completedSession, ...state.practiceHistory],
            }));
          }
        },
        
        addPracticeSession: (session) => {
          set((state) => ({
            practiceHistory: [session, ...state.practiceHistory],
          }));
        },
        
        // 설정 관련 액션
        updateSettings: (newSettings) => {
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          }));
        },
        
        resetSettings: () => set({ settings: initialState.settings }),
      }),
      {
        name: 'chordmind-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'chordmind-store',
    }
  )
);

// 선택자 함수들
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
export const useCurrentPracticeSession = () => useAppStore((state) => state.currentPracticeSession);
export const usePracticeHistory = () => useAppStore((state) => state.practiceHistory);
export const useSettings = () => useAppStore((state) => state.settings);
