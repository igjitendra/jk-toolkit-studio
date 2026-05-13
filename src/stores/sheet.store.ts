import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SheetConfig, SheetLayout } from '@/types';
import { DEFAULT_SHEET_CONFIG } from '@/constants/defaults';

interface SheetState {
  config: SheetConfig;
  layouts: SheetLayout[];
  activeLayoutIndex: number;
  isGenerating: boolean;
  lastGeneratedAt: number | null;

  setConfig: (patch: Partial<SheetConfig>) => void;
  addLayout: (layout: SheetLayout) => void;
  removeLayout: (id: string) => void;
  setActiveLayout: (index: number) => void;
  setGenerating: (v: boolean) => void;
  clearLayouts: () => void;
}

export const useSheetStore = create<SheetState>()(
  persist(
    (set) => ({
      config: DEFAULT_SHEET_CONFIG,
      layouts: [],
      activeLayoutIndex: 0,
      isGenerating: false,
      lastGeneratedAt: null,

      setConfig: (patch) =>
        set((s) => ({ config: { ...s.config, ...patch } })),

      addLayout: (layout) =>
        set((s) => ({ layouts: [...s.layouts, layout], lastGeneratedAt: Date.now() })),

      removeLayout: (id) =>
        set((s) => ({ layouts: s.layouts.filter((l) => l.id !== id) })),

      setActiveLayout: (index) => set({ activeLayoutIndex: index }),

      setGenerating: (v) => set({ isGenerating: v }),

      clearLayouts: () => set({ layouts: [], activeLayoutIndex: 0 }),
    }),
    {
      name: 'jk-studio-sheet',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({ config: state.config, layouts: state.layouts }),
    }
  )
);
