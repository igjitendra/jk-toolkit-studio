// ============================================================
// JK Toolkit Studio — Master Type Definitions
// ============================================================

export type Unit = 'mm' | 'inch' | 'cm' | 'px';

export type PhotoSizePreset =
  | 'passport'
  | 'visa'
  | 'stamp'
  | 'id_card'
  | 'wallet'
  | 'exam_form'
  | 'custom';

export interface PhotoSize {
  label: string;
  width: number;   // in mm
  height: number;  // in mm
  preset: PhotoSizePreset;
}

export type BackgroundMode = 'white' | 'blue' | 'red' | 'transparent' | 'custom';
export type BorderStyle = 'none' | 'thin' | 'thick';
export type ProcessingStatus = 'idle' | 'processing' | 'done' | 'error';
export type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Person {
  id: string;
  name: string;
  photoFile?: File;
  photoDataUrl?: string;
  processedDataUrl?: string;   // after bg removal + face align
  size: PhotoSize;
  quantity: number;
  background: BackgroundMode;
  customBgColor?: string;
  border: BorderStyle;
  borderColor?: string;
  notes?: string;
  faceDetected?: boolean;
  processingStatus: ProcessingStatus;
  createdAt: number;
}

export type PaperSize = 'A4' | 'A5' | 'Letter' | '4x6';

export interface PaperDimensions {
  width: number;   // mm
  height: number;  // mm
  label: string;
}

export interface SheetConfig {
  paper: PaperSize;
  dpi: 150 | 300 | 600;
  margin: number;    // mm
  gutterH: number;   // horizontal gutter mm
  gutterV: number;   // vertical gutter mm
  showCutGuides: boolean;
  showBleed: boolean;
  bleedSize: number; // mm
  orientation: 'portrait' | 'landscape';
}

export interface PlacedPhoto {
  personId: string;
  instanceIndex: number;
  x: number;   // mm from top-left
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface SheetLayout {
  id: string;
  config: SheetConfig;
  placed: PlacedPhoto[];
  efficiency: number;  // 0-1 fill ratio
  createdAt: number;
}

export interface QueueItem {
  id: string;
  personId: string;
  personName: string;
  status: QueueStatus;
  progress: number;  // 0-100
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface Project {
  id: string;
  name: string;
  persons: Person[];
  sheetConfig: SheetConfig;
  layouts: SheetLayout[];
  createdAt: number;
  updatedAt: number;
  version: string;
}

export type ExportFormat = 'jpg' | 'png' | 'pdf' | 'zip';

export interface ExportOptions {
  format: ExportFormat;
  quality: number;    // 0.1-1.0
  dpi: number;
  filename?: string;
  includeAllSheets: boolean;
}

export type IDCardTemplate = 'school' | 'office' | 'student' | 'visitor' | 'membership' | 'custom';

export interface IDCardField {
  id: string;
  type: 'text' | 'image' | 'qr' | 'barcode' | 'logo';
  label: string;
  value: string;
  x: number;      // % of card width
  y: number;      // % of card height
  width: number;  // % of card width
  height: number; // % of card height
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  rotation?: number;
}

export interface IDCard {
  id: string;
  template: IDCardTemplate;
  fields: IDCardField[];
  bgColor: string;
  bgImageUrl?: string;
  width: number;   // mm  e.g. 85.6
  height: number;  // mm  e.g. 54
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  printHistory: Array<{
    projectId: string;
    date: number;
    description: string;
  }>;
  createdAt: number;
}

export interface StudioBranding {
  name: string;
  logoUrl?: string;
  watermarkText?: string;
  watermarkOpacity: number;
  showOnExport: boolean;
  tagline?: string;
}

// Worker message types
export type WorkerMessageType =
  | 'PROCESS_FACE'
  | 'REMOVE_BACKGROUND'
  | 'GENERATE_SHEET'
  | 'EXPORT_PDF'
  | 'EXPORT_ZIP'
  | 'RESIZE_IMAGE';

export interface WorkerMessage {
  type: WorkerMessageType;
  payload: unknown;
  requestId: string;
}

export interface WorkerResponse {
  type: WorkerMessageType;
  result?: unknown;
  error?: string;
  requestId: string;
  progress?: number;
}
