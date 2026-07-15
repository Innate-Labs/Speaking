import type { AppUser } from "@/types";

export interface StorageLike {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

const STORAGE_PREFIX = "speakcoach_";

export function isDemoMode(value?: string): boolean {
  return value === "true";
}

export const DEMO_MODE = isDemoMode(process.env.NEXT_PUBLIC_DEMO_MODE);

export const DEMO_USER: AppUser = {
  id: "demo-user",
  displayName: "演示访客",
  phone: "",
};

export function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
}

export function clearSpeakCoachStorage(storage: StorageLike): number {
  const keys: string[] = [];

  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key);
    }
  } catch {
    return 0;
  }

  let removed = 0;
  for (const key of keys) {
    try {
      storage.removeItem(key);
      removed += 1;
    } catch {
      // Demo mode never reads legacy storage, so a blocked deletion is safe.
    }
  }
  return removed;
}

const demoStorage = createMemoryStorage();
let demoSessionInitialized = false;

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function initializeDemoSession(): boolean {
  if (!DEMO_MODE || demoSessionInitialized) return false;
  demoStorage.clear();
  const browserStorage = getBrowserStorage();
  if (browserStorage) clearSpeakCoachStorage(browserStorage);
  demoSessionInitialized = true;
  return true;
}

export function readAppStorage(key: string): string | null {
  if (DEMO_MODE) return demoStorage.getItem(key);
  const storage = getBrowserStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeAppStorage(key: string, value: string): void {
  if (DEMO_MODE) {
    demoStorage.setItem(key, value);
    return;
  }
  const storage = getBrowserStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function removeAppStorage(key: string): void {
  if (DEMO_MODE) {
    demoStorage.removeItem(key);
    return;
  }
  const storage = getBrowserStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}
