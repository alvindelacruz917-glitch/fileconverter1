import { AppSettings, HistoryRecord, UserProfile, CreditState, FeedbackItem } from '../types/converter';

const SETTINGS_KEY = 'universal_file_converter_settings';
const HISTORY_KEY = 'universal_file_converter_history';
const CREDITS_KEY = 'universal_file_converter_credits';
const USER_KEY = 'universal_file_converter_user';
const FEEDBACK_KEY = 'universal_file_converter_feedback';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#2563EB',
  outputFolder: 'Downloads/ConvertedFiles',
  rememberLastFolder: true,
  autoOpenOutput: true,
  rememberWindowSize: true,
  language: 'English',
  soundEffects: true,
};

const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveStoredSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const getStoredHistory = (): HistoryRecord[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse history:', e);
  }
  return [];
};

export const addHistoryRecord = (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => {
  try {
    const current = getStoredHistory();
    const newRecord: HistoryRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    };
    const updated = [newRecord, ...current].slice(0, 200);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

    // Save to Firestore if user is signed in
    const user = getStoredUser();
    if (user && user.id) {
      import('../lib/firebase').then(({ saveConversionRecord }) => {
        saveConversionRecord({
          userId: user.id,
          fileName: record.sourceNames?.[0] || 'file',
          fileSize: record.outputSize || 0,
          toolId: record.toolId,
          toolName: record.toolName,
          outputName: record.outputName,
          status: 'completed'
        });
      }).catch(err => console.warn('Firestore async save notice:', err));
    }

    return updated;
  } catch (e) {
    console.error('Failed to add history record:', e);
    return [];
  }
};

export const clearStoredHistory = () => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
};

export const removeHistoryRecord = (id: string): HistoryRecord[] => {
  try {
    const current = getStoredHistory();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove history record:', e);
    return [];
  }
};

// --- CREDITS SYSTEM (5 free conversions per day) ---
export const getStoredCredits = (): CreditState => {
  const today = getTodayStr();
  const defaultCredits: CreditState = {
    remaining: 5,
    max: 5,
    lastResetDate: today,
  };

  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (!raw) {
      localStorage.setItem(CREDITS_KEY, JSON.stringify(defaultCredits));
      return defaultCredits;
    }
    const parsed: CreditState = JSON.parse(raw);
    if (parsed.lastResetDate !== today) {
      // Automatic daily reset!
      const resetState: CreditState = {
        remaining: 5,
        max: 5,
        lastResetDate: today,
      };
      localStorage.setItem(CREDITS_KEY, JSON.stringify(resetState));
      return resetState;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read credits:', e);
    return defaultCredits;
  }
};

export const consumeCredit = (): CreditState => {
  const current = getStoredCredits();
  if (current.remaining <= 0) {
    return current;
  }
  const updated: CreditState = {
    ...current,
    remaining: current.remaining - 1,
  };
  try {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update credit:', e);
  }
  return updated;
};

export const setStoredCredits = (amount: number): CreditState => {
  const current = getStoredCredits();
  const updated: CreditState = {
    ...current,
    remaining: Math.max(0, amount),
    max: Math.max(current.max, amount),
  };
  try {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to set stored credit:', e);
  }
  return updated;
};

const REGISTERED_USERS_KEY = 'universal_file_converter_registered_users';

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  isAdmin?: boolean;
  plan?: 'FREE' | 'PRO';
  credits?: number;
}

export const getRegisteredUsers = (): RegisteredAccount[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const users: RegisteredAccount[] = JSON.parse(raw);
      // Ensure default credits = 5 if not set
      return users.map(u => ({
        ...u,
        credits: typeof u.credits === 'number' ? u.credits : 5,
        plan: u.plan || 'FREE'
      }));
    }
  } catch (e) {
    console.error('Failed to parse registered users:', e);
  }
  return [];
};

export const registerUserAccount = (acc: Omit<RegisteredAccount, 'id' | 'createdAt'>): RegisteredAccount => {
  const current = getRegisteredUsers();
  const newAcc: RegisteredAccount = {
    ...acc,
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    credits: typeof acc.credits === 'number' ? acc.credits : 5,
    plan: acc.plan || 'FREE',
  };
  const updated = [...current.filter(u => u.email.toLowerCase() !== acc.email.toLowerCase()), newAcc];
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered account:', e);
  }
  return newAcc;
};

export const updateRegisteredUserCredits = (userId: string, newCredits: number): RegisteredAccount[] => {
  const current = getRegisteredUsers();
  const updated = current.map(u => {
    if (u.id === userId) {
      return { ...u, credits: Math.max(0, newCredits) };
    }
    return u;
  });
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update user credits:', e);
  }

  // If this user is currently logged in, sync their credits local state
  const currentUser = getStoredUser();
  if (currentUser && currentUser.id === userId) {
    setStoredCredits(newCredits);
  }

  return updated;
};

export const updateRegisteredUserPlan = (userId: string, newPlan: 'FREE' | 'PRO'): RegisteredAccount[] => {
  const current = getRegisteredUsers();
  const updated = current.map(u => {
    if (u.id === userId) {
      return { ...u, plan: newPlan };
    }
    return u;
  });
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update user plan:', e);
  }

  const currentUser = getStoredUser();
  if (currentUser && currentUser.id === userId) {
    saveStoredUser({ ...currentUser, plan: newPlan });
  }

  return updated;
};

export const deleteRegisteredUser = (userId: string): RegisteredAccount[] => {
  const current = getRegisteredUsers();
  const updated = current.filter(u => u.id !== userId);
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete user:', e);
  }
  return updated;
};

// --- AUTH & USER SYSTEM ---
export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const u: UserProfile = JSON.parse(raw);
      // Strictly enforce admin flag only for valid admin email or handle explicitly
      if (
        u.email?.toLowerCase().includes('admin123') ||
        u.email?.toLowerCase() === 'alvindelacruz917@gmail.com'
      ) {
        u.isAdmin = true;
      } else {
        u.isAdmin = false;
      }
      return u;
    }
  } catch (e) {
    console.error('Failed to read user profile:', e);
  }
  return null;
};

export const saveStoredUser = (user: UserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save user:', e);
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to logout user:', e);
  }
};

// --- FEEDBACK SYSTEM ---
export const getStoredFeedback = (): FeedbackItem[] => {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read feedback:', e);
  }
  return [];
};

export const addFeedbackRecord = (item: Omit<FeedbackItem, 'id' | 'timestamp'>) => {
  try {
    const current = getStoredFeedback();
    const newItem: FeedbackItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    };
    const updated = [newItem, ...current];
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save feedback:', e);
    return [];
  }
};

