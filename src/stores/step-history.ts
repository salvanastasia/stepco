import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { isSameDay } from 'date-fns';

export interface StepRecord {
  date: Date;
  steps: number;
}

const DEFAULT_GOAL = 10000;

const storage: PersistStorage<Partial<StepHistoryState>> = {
  getItem: async (name) => {
    const str = await AsyncStorage.getItem(name);
    if (!str) return null;
    const parsed = JSON.parse(str);
    // Convert date strings back to Date objects
    if (parsed.state?.stepHistory) {
      parsed.state.stepHistory = parsed.state.stepHistory.map((r: { date: string; steps: number }) => ({
        ...r,
        date: new Date(r.date),
      }));
    }
    return parsed;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

type Unit = 'steps' | 'km';

interface StepHistoryState {
  stepHistory: StepRecord[];
  isWalking: boolean;
  currentSteps: number;
  goal: number;
  unit: Unit;
  setGoal: (goal: number) => void;
  setUnit: (unit: Unit) => void;
  incrementSteps: (delta: number) => void;
  start: () => void;
  stop: () => void;
  clearHistory: () => void;
  getTodaySteps: () => number;
}

export const useStepHistoryStore = create<StepHistoryState>()(
  persist(
    (set, get) => ({
      stepHistory: [],
      isWalking: false,
      currentSteps: 0,
      goal: DEFAULT_GOAL,
      unit: 'steps',

      setGoal: (goal: number) => set({ goal }),
      setUnit: (unit: Unit) => set({ unit }),

      incrementSteps: (delta: number) => {
        const { currentSteps } = get();
        set({ currentSteps: currentSteps + delta });
      },

      getTodaySteps: () => {
        const { stepHistory } = get();
        const today = new Date();
        const todayRecord = stepHistory.find((r) => isSameDay(r.date, today));
        return todayRecord?.steps ?? 0;
      },

      start: () => {
        const { stepHistory, goal } = get();
        const today = new Date();
        const todayRecord = stepHistory.find((r) => isSameDay(r.date, today));

        if (todayRecord && todayRecord.steps < goal) {
          // Resume from today's steps
          set({ isWalking: true, currentSteps: todayRecord.steps });
        } else {
          // Start fresh
          set({ isWalking: true, currentSteps: 0 });
        }
      },

      stop: () => {
        const { currentSteps, stepHistory } = get();
        if (currentSteps <= 0) {
          set({ isWalking: false });
          return;
        }

        const today = new Date();
        const existingIndex = stepHistory.findIndex((r) => isSameDay(r.date, today));

        if (existingIndex >= 0) {
          // Update today's record (replace, not add)
          const updatedHistory = [...stepHistory];
          updatedHistory[existingIndex] = { date: today, steps: currentSteps };
          set({ stepHistory: updatedHistory, isWalking: false });
        } else {
          // Create new record
          set({
            stepHistory: [{ date: today, steps: currentSteps }, ...stepHistory],
            isWalking: false,
          });
        }
      },

      clearHistory: () => set({ stepHistory: [], currentSteps: 0, isWalking: false }),
    }),
    {
      name: 'step-history-storage',
      storage,
      partialize: (state) => ({
        stepHistory: state.stepHistory,
        isWalking: state.isWalking,
        currentSteps: state.currentSteps,
        goal: state.goal,
        unit: state.unit,
      }),
    }
  )
);
