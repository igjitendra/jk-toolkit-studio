// ============================================================
// JK Toolkit Studio — useExport Hook
// Unified export handler for JPG/PNG/PDF/ZIP
// ============================================================

import { useCallback, useState } from 'react';
import { usePersonsStore } from '@/stores/persons.store';
import { useSheetStore } from '@/stores/sheet.store';
import {
  exportAsJpg,
  exportAsPng,
  exportAsPdf,
  exportAsZip,
  downloadBlob,
} from '@/modules/export/exporters';
import type { ExportOptions } from '@/types';

export function useExport() {
  const [isExporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const doExport = useCallback(
    async (options: ExportOptions) => {
      const { persons } = usePersonsStore.getState();
      const { layouts } = useSheetStore.getState();
      if (layouts.length === 0) return;

      setExporting(true);
      setProgress(0);

      try {
        const filename = options.filename ?? `jk_studio_${Date.now()}`;

        switch (options.format) {
          case 'jpg': {
            setProgress(50);
            const blob = await exportAsJpg(layouts[0], persons, options);
            downloadBlob(blob, `${filename}.jpg`);
            break;
          }
          case 'png': {
            setProgress(50);
            const blob = await exportAsPng(layouts[0], persons, options);
            downloadBlob(blob, `${filename}.png`);
            break;
          }
          case 'pdf': {
            setProgress(30);
            const blob = await exportAsPdf(layouts, persons, options);
            setProgress(90);
            downloadBlob(blob, `${filename}.pdf`);
            break;
          }
          case 'zip': {
            const blob = await exportAsZip(layouts, persons, options);
            downloadBlob(blob, `${filename}.zip`);
            break;
          }
        }
      } finally {
        setProgress(100);
        setTimeout(() => { setExporting(false); setProgress(0); }, 1500);
      }
    },
    []
  );

  return { doExport, isExporting, progress };
}
