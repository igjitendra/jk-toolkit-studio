import type { PhotoSize } from '@/types';

export const PHOTO_SIZES: Record<string, PhotoSize> = {
  passport: { label: 'Passport (35×45mm)', width: 35, height: 45, preset: 'passport' },
  visa: { label: 'Visa (51×51mm)', width: 51, height: 51, preset: 'visa' },
  stamp: { label: 'Stamp Size (25×25mm)', width: 25, height: 25, preset: 'stamp' },
  id_card: { label: 'ID Card (33×48mm)', width: 33, height: 48, preset: 'id_card' },
  wallet: { label: 'Wallet (57×76mm)', width: 57, height: 76, preset: 'wallet' },
  exam_form: { label: 'Exam Form (35×45mm)', width: 35, height: 45, preset: 'exam_form' },
  custom: { label: 'Custom Size', width: 35, height: 45, preset: 'custom' },
};

export const PHOTO_SIZES_LIST = Object.values(PHOTO_SIZES);
