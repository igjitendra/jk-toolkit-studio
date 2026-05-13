import { create } from 'zustand';
import type { QueueItem } from '@/types';

interface QueueState {
  items: QueueItem[];
  isRunning: boolean;

  enqueue: (item: QueueItem) => void;
  dequeue: (id: string) => void;
  updateItem: (id: string, patch: Partial<QueueItem>) => void;
  clearCompleted: () => void;
  setRunning: (v: boolean) => void;
}

export const useQueueStore = create<QueueState>()((set) => ({
  items: [],
  isRunning: false,

  enqueue: (item) =>
    set((s) => ({ items: [...s.items, item] })),

  dequeue: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  updateItem: (id, patch) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),

  clearCompleted: () =>
    set((s) => ({ items: s.items.filter((i) => i.status !== 'completed') })),

  setRunning: (v) => set({ isRunning: v }),
}));
