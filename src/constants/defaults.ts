import type { SheetConfig } from '@/types';

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  paper: 'A4',
  dpi: 300,
  margin: 5,
  gutterH: 2,
  gutterV: 2,
  showCutGuides: true,
  showBleed: false,
  bleedSize: 1,
  orientation: 'portrait',
};

export const APP_VERSION = '0.1.0';
export const MAX_PERSONS = 30;
export const MAX_PHOTO_SIZE_MB = 20;
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
