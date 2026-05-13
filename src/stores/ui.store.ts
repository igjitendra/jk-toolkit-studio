import { create } from 'zustand';

export type ActivePanel = 'upload' | 'layout' | 'idcard' | 'batch' | 'history' | 'settings';
export type RightPanel = 'properties' | 'sheet' | 'export' | 'branding';

interface UIState {
  activePanel: ActivePanel;
  rightPanel: RightPanel;
  isMobileSidebarOpen: boolean;
  isMobileRightOpen: boolean;
  zoom: number;
  showGrid: boolean;
  showRulers: boolean;
  isDarkMode: boolean;

  setActivePanel: (p: ActivePanel) => void;
  setRightPanel: (p: RightPanel) => void;
  setMobileSidebar: (v: boolean) => void;
  setMobileRight: (v: boolean) => void;
  setZoom: (z: number) => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activePanel: 'upload',
  rightPanel: 'properties',
  isMobileSidebarOpen: false,
  isMobileRightOpen: false,
  zoom: 1,
  showGrid: false,
  showRulers: false,
  isDarkMode: true,

  setActivePanel: (p) => set({ activePanel: p }),
  setRightPanel: (p) => set({ rightPanel: p }),
  setMobileSidebar: (v) => set({ isMobileSidebarOpen: v }),
  setMobileRight: (v) => set({ isMobileRightOpen: v }),
  setZoom: (z) => set({ zoom: Math.min(3, Math.max(0.25, z)) }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
}));
