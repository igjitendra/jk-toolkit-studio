// ============================================================
// JK Toolkit Studio — useLayoutEngine Hook
// Triggers packing and stores results
// ============================================================

import { useCallback } from 'react';
import { usePersonsStore } from '@/stores/persons.store';
import { useSheetStore } from '@/stores/sheet.store';
import { packPhotosToSheets } from '@/modules/layout/packing-engine';

export function useLayoutEngine() {
  const { config, setGenerating, clearLayouts, addLayout } = useSheetStore();

  const generateLayout = useCallback(async () => {
    const { persons } = usePersonsStore.getState();
    if (persons.length === 0) return;

    setGenerating(true);
    clearLayouts();

    // Run in next tick to allow UI update
    await new Promise((r) => setTimeout(r, 0));

    try {
      const sheets = packPhotosToSheets(persons, config);
      for (const sheet of sheets) {
        addLayout(sheet);
      }
    } finally {
      setGenerating(false);
    }
  }, [config, setGenerating, clearLayouts, addLayout]);

  return { generateLayout };
}
