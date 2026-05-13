import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Person, PhotoSize, BackgroundMode, BorderStyle } from '@/types';
import { PHOTO_SIZES } from '@/constants/photo-sizes';
import { nanoid } from './utils';

interface PersonsState {
  persons: Person[];
  selectedPersonId: string | null;

  // Actions
  addPerson: () => void;
  removePerson: (id: string) => void;
  updatePerson: (id: string, patch: Partial<Person>) => void;
  setSelectedPerson: (id: string | null) => void;
  reorderPersons: (fromIndex: number, toIndex: number) => void;
  clearAll: () => void;
  setProcessedPhoto: (id: string, dataUrl: string) => void;
}

function nanoid(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const usePersonsStore = create<PersonsState>()(
  persist(
    (set) => ({
      persons: [],
      selectedPersonId: null,

      addPerson: () =>
        set((state) => {
          const newPerson: Person = {
            id: nanoid(),
            name: `Person ${state.persons.length + 1}`,
            size: PHOTO_SIZES.passport,
            quantity: 2,
            background: 'white',
            border: 'none',
            processingStatus: 'idle',
            createdAt: Date.now(),
          };
          return {
            persons: [...state.persons, newPerson],
            selectedPersonId: newPerson.id,
          };
        }),

      removePerson: (id) =>
        set((state) => ({
          persons: state.persons.filter((p) => p.id !== id),
          selectedPersonId:
            state.selectedPersonId === id ? null : state.selectedPersonId,
        })),

      updatePerson: (id, patch) =>
        set((state) => ({
          persons: state.persons.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),

      setSelectedPerson: (id) => set({ selectedPersonId: id }),

      reorderPersons: (fromIndex, toIndex) =>
        set((state) => {
          const arr = [...state.persons];
          const [item] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, item);
          return { persons: arr };
        }),

      clearAll: () => set({ persons: [], selectedPersonId: null }),

      setProcessedPhoto: (id, dataUrl) =>
        set((state) => ({
          persons: state.persons.map((p) =>
            p.id === id
              ? { ...p, processedDataUrl: dataUrl, processingStatus: 'done' }
              : p
          ),
        })),
    }),
    {
      name: 'jk-studio-persons',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({ persons: state.persons }),
    }
  )
);
