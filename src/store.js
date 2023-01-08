import create from "zustand";
import { persist } from "zustand/middleware";

export const settingsStore = create(
  persist(
    (set) => ({
      canDelete: false,
      canSetSides: false,
      isGm: false,
      detailedHistory: false,
      setCanDelete: (value) => set(() => ({ canDelete: value })),
      setCanSetSides: (value) => set(() => ({ canSetSides: value })),
      setIsGm: (value) => set(() => ({ isGm: value })),
      setDetailedHistory: (value) => set(() => ({ detailedHistory: value }))
    }),
    {
      name: "dice-settings-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage // (optional) by default, 'localStorage' is used
    }
  )
);

export const connectionStore = create(persist((set) => ({}), {}));
export const layoutStore = create(persist((set) => ({}), {}));
export const statStore = create(
  persist(
    (set) => ({
      locked: false,
      setLocked: (value) => set(() => ({ locked: value }))
    }),
    {
      name: "dice-stat-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage // (optional) by default, 'localStorage' is used
    }
  )
);
export const diceStore = create(persist((set) => ({}), {}));
export const presetStore = create(
  persist(
    (set) => ({
      locked: false,
      setLocked: (value) => set(() => ({ locked: value }))
    }),
    {
      name: "dice-preset-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage // (optional) by default, 'localStorage' is used
    }
  )
);
