// ============================================================
// JK Toolkit Studio — usePhotoProcessor Hook
// Orchestrates face detection + bg removal per person
// ============================================================

import { useCallback } from 'react';
import { usePersonsStore } from '@/stores/persons.store';
import { detectAndAlignFace } from '@/modules/ai/face-detector';
import { replaceSolidBackground, applyBackgroundColor } from '@/modules/ai/background-remover';
import { mmToPx } from '@/constants/paper-sizes';

export function usePhotoProcessor() {
  const { updatePerson, setProcessedPhoto } = usePersonsStore();

  const processPhoto = useCallback(
    async (personId: string) => {
      const { persons } = usePersonsStore.getState();
      const person = persons.find((p) => p.id === personId);
      if (!person?.photoDataUrl) return;

      updatePerson(personId, { processingStatus: 'processing' });

      try {
        const targetW = mmToPx(person.size.width, 300);
        const targetH = mmToPx(person.size.height, 300);

        // Step 1: Face detection & align
        const faceResult = await detectAndAlignFace(
          person.photoDataUrl,
          targetW,
          targetH
        );
        let workingUrl = faceResult.croppedDataUrl ?? person.photoDataUrl;

        // Step 2: Background removal/replace
        if (person.background !== 'transparent') {
          const colorMap: Record<string, string> = {
            white: '#ffffff',
            blue: '#4a90d9',
            red: '#d94a4a',
            custom: person.customBgColor ?? '#ffffff',
          };
          const bgColor = colorMap[person.background] ?? '#ffffff';
          workingUrl = await replaceSolidBackground(workingUrl, {
            mode: 'solid',
            replaceColor: 'transparent',
            tolerance: 35,
          });
          workingUrl = await applyBackgroundColor(workingUrl, bgColor);
        }

        setProcessedPhoto(personId, workingUrl);
        updatePerson(personId, { faceDetected: faceResult.success });
      } catch (err) {
        updatePerson(personId, {
          processingStatus: 'error',
          processingStatus: 'error',
        });
      }
    },
    [updatePerson, setProcessedPhoto]
  );

  const processAll = useCallback(async () => {
    const { persons } = usePersonsStore.getState();
    for (const p of persons) {
      if (p.photoDataUrl && p.processingStatus === 'idle') {
        await processPhoto(p.id);
      }
    }
  }, [processPhoto]);

  return { processPhoto, processAll };
}
