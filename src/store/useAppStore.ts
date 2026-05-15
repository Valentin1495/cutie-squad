import { Storage } from "@apps-in-toss/web-framework";
import { create } from "zustand";

export interface Goal {
  id: string;
  text: string;
  emoji: string;
  done: boolean;
  createdAt: string;
}

export interface GoalInput {
  id?: string;
  text: string;
  emoji: string;
}

export interface Character {
  id: string;
  emoji: string;
  name: string;
  unlockedAt: string;
  requiredCount: number;
}

export const ALL_CHARACTERS: Character[] = [
  { id: "cat", emoji: "🐱", name: "냥냥이", unlockedAt: "", requiredCount: 1 },
  { id: "dog", emoji: "🐶", name: "멍멍이", unlockedAt: "", requiredCount: 2 },
  { id: "hamster", emoji: "🐹", name: "햄찌", unlockedAt: "", requiredCount: 3 },
  { id: "rabbit", emoji: "🐰", name: "토리", unlockedAt: "", requiredCount: 5 },
  { id: "fox", emoji: "🦊", name: "여우비", unlockedAt: "", requiredCount: 7 },
  { id: "frog", emoji: "🐸", name: "개구리왕", unlockedAt: "", requiredCount: 10 },
  { id: "unicorn", emoji: "🦄", name: "유니콘", unlockedAt: "", requiredCount: 15 },
  { id: "panda", emoji: "🐼", name: "판다곰", unlockedAt: "", requiredCount: 20 },
];

export const RECOMMENDED_GOALS: GoalInput[] = [
  { text: "물 마시기", emoji: "💧" },
  { text: "산책하기", emoji: "🚶" },
  { text: "책 읽기", emoji: "📚" },
  { text: "스트레칭", emoji: "🧘" },
  { text: "햇빛 쬐기", emoji: "☀️" },
];

const STORAGE_KEY = "cutie-squad-state";

interface PersistedState {
  goals: Goal[];
  unlockedCharacters: Character[];
  totalCompletionCount: number;
  lastResetDate: string;
  hasOnboarded: boolean;
}

type LegacyPersistedState = Partial<PersistedState> & {
  goals?: Array<Partial<Goal>>;
};

interface AppState extends PersistedState {
  isLoaded: boolean;
  showCelebration: boolean;
  newCharacter: Character | null;
  toggleGoal: (id: string) => void;
  resetGoals: () => void;
  loadFromStorage: () => Promise<void>;
  completeOnboarding: (goals: GoalInput[]) => void;
  saveGoals: (goals: GoalInput[]) => void;
  updateGoals: (goals: GoalInput[]) => void;
  resetOnboarding: () => void;
  setShowCelebration: (show: boolean) => void;
  clearNewCharacter: () => void;
}

function createGoalId(): string {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const date = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function normalizeGoal(goal: Partial<Goal>, fallbackIndex: number): Goal {
  return {
    id: goal.id ?? `legacy-${fallbackIndex}`,
    text: goal.text ?? "",
    emoji: goal.emoji ?? "💧",
    done: goal.done ?? false,
    createdAt: goal.createdAt ?? new Date().toISOString(),
  };
}

function buildGoals(inputs: GoalInput[], previousGoals: Goal[] = []): Goal[] {
  const previousById = new Map(previousGoals.map((goal) => [goal.id, goal]));

  return inputs.map((input) => {
    const previous = input.id == null ? undefined : previousById.get(input.id);

    return {
      id: previous?.id ?? input.id ?? createGoalId(),
      text: input.text.trim(),
      emoji: input.emoji,
      done: previous?.done ?? false,
      createdAt: previous?.createdAt ?? new Date().toISOString(),
    };
  });
}

function getPersistedState(state: AppState): PersistedState {
  return {
    goals: state.goals,
    unlockedCharacters: state.unlockedCharacters,
    totalCompletionCount: state.totalCompletionCount,
    lastResetDate: state.lastResetDate,
    hasOnboarded: state.hasOnboarded,
  };
}

async function persistSave(state: PersistedState): Promise<void> {
  try {
    await Storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 저장할 수 없는 환경에서는 현재 세션 상태만 유지해요.
    }
  }
}

async function persistLoad(): Promise<LegacyPersistedState | null> {
  try {
    const raw = await Storage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LegacyPersistedState;
  } catch {
    // 브리지 환경이 아니면 localStorage fallback을 사용해요.
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LegacyPersistedState;
  } catch {
    // localStorage가 없는 환경에서는 빈 상태로 시작해요.
  }

  return null;
}

export const useAppStore = create<AppState>((set, get) => ({
  goals: [],
  unlockedCharacters: [],
  totalCompletionCount: 0,
  lastResetDate: getTodayString(),
  hasOnboarded: false,
  isLoaded: false,
  showCelebration: false,
  newCharacter: null,

  loadFromStorage: async () => {
    const saved = await persistLoad();
    const today = getTodayString();

    if (!saved) {
      set({ isLoaded: true, lastResetDate: today, hasOnboarded: false });
      return;
    }

    const savedGoals = (saved.goals ?? []).map(normalizeGoal);
    const goals =
      saved.lastResetDate !== today
        ? savedGoals.map((goal) => ({ ...goal, done: false }))
        : savedGoals;
    const hasOnboarded = saved.hasOnboarded ?? savedGoals.length > 0;

    set({
      goals,
      unlockedCharacters: saved.unlockedCharacters ?? [],
      totalCompletionCount: saved.totalCompletionCount ?? 0,
      lastResetDate: today,
      hasOnboarded,
      isLoaded: true,
    });
  },

  toggleGoal: (id: string) => {
    const { goals, totalCompletionCount, unlockedCharacters } = get();
    const goal = goals.find((item) => item.id === id);
    if (!goal || goal.done) return;

    const newGoals = goals.map((item) =>
      item.id === id ? { ...item, done: true } : item,
    );
    const newCount = totalCompletionCount + 1;
    const allDone = newGoals.length > 0 && newGoals.every((item) => item.done);

    const alreadyUnlockedIds = new Set(
      unlockedCharacters.map((character) => character.id),
    );
    const newCharacter = ALL_CHARACTERS.find(
      (character) =>
        character.requiredCount === newCount &&
        !alreadyUnlockedIds.has(character.id),
    );
    const newUnlockedCharacters =
      newCharacter == null
        ? unlockedCharacters
        : [
            ...unlockedCharacters,
            { ...newCharacter, unlockedAt: new Date().toISOString() },
          ];

    set({
      goals: newGoals,
      totalCompletionCount: newCount,
      unlockedCharacters: newUnlockedCharacters,
      showCelebration: allDone,
      newCharacter: newCharacter ?? null,
    });

    persistSave({
      ...getPersistedState(get()),
      goals: newGoals,
      unlockedCharacters: newUnlockedCharacters,
      totalCompletionCount: newCount,
    });
  },

  resetGoals: () => {
    const today = getTodayString();
    const goals = get().goals.map((goal) => ({ ...goal, done: false }));

    set({ goals, lastResetDate: today, showCelebration: false });
    persistSave({ ...getPersistedState(get()), goals, lastResetDate: today });
  },

  completeOnboarding: (inputs: GoalInput[]) => {
    const goals = buildGoals(inputs);
    const today = getTodayString();

    set({
      goals,
      hasOnboarded: true,
      lastResetDate: today,
      showCelebration: false,
    });
    persistSave({
      ...getPersistedState(get()),
      goals,
      hasOnboarded: true,
      lastResetDate: today,
    });
  },

  saveGoals: (inputs: GoalInput[]) => {
    get().updateGoals(inputs);
  },

  updateGoals: (inputs: GoalInput[]) => {
    const goals = buildGoals(inputs, get().goals);

    set({ goals, hasOnboarded: true });
    persistSave({ ...getPersistedState(get()), goals, hasOnboarded: true });
  },

  resetOnboarding: () => {
    const today = getTodayString();
    const nextState: PersistedState = {
      goals: [],
      unlockedCharacters: [],
      totalCompletionCount: 0,
      lastResetDate: today,
      hasOnboarded: false,
    };

    set({
      ...nextState,
      showCelebration: false,
      newCharacter: null,
    });
    persistSave(nextState);
  },

  setShowCelebration: (show: boolean) => set({ showCelebration: show }),
  clearNewCharacter: () => set({ newCharacter: null }),
}));
