// Fabric.js type augmentations for JK Toolkit Studio
declare module 'fabric' {
  interface Canvas {
    isDragging?: boolean;
    lastPosX?: number;
    lastPosY?: number;
  }
  interface Object {
    personId?: string;
    instanceIndex?: number;
    isGuide?: boolean;
    isCutMark?: boolean;
  }
}
