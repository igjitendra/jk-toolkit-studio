'use client';
import { useSheetStore } from '@/stores/sheet.store';
import type { PaperSize } from '@/types';

const PAPER_OPTIONS: PaperSize[] = ['A4', 'A5', 'Letter', '4x6'];
const DPI_OPTIONS = [150, 300, 600] as const;

export function SheetSettingsPanel() {
  const { config, setConfig } = useSheetStore();

  return (
    <div className="p-4 space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Paper Size</h3>
        <div className="grid grid-cols-2 gap-2">
          {PAPER_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setConfig({ paper: p })}
              className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                config.paper === p
                  ? 'border-studio-accent bg-studio-accent/10 text-studio-accent'
                  : 'border-studio-border text-studio-text-muted hover:border-studio-muted'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Resolution (DPI)</h3>
        <div className="flex gap-2">
          {DPI_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setConfig({ dpi: d })}
              className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                config.dpi === d
                  ? 'border-studio-accent bg-studio-accent/10 text-studio-accent'
                  : 'border-studio-border text-studio-text-muted hover:border-studio-muted'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Margins & Guides</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-studio-text">Cut Guides</label>
            <button
              onClick={() => setConfig({ showCutGuides: !config.showCutGuides })}
              className={`h-5 w-9 rounded-full transition-colors ${
                config.showCutGuides ? 'bg-studio-accent' : 'bg-studio-muted'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white shadow transition-transform mx-0.5 ${
                  config.showCutGuides ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-studio-text">Show Bleed</label>
            <button
              onClick={() => setConfig({ showBleed: !config.showBleed })}
              className={`h-5 w-9 rounded-full transition-colors ${
                config.showBleed ? 'bg-studio-accent' : 'bg-studio-muted'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white shadow transition-transform mx-0.5 ${
                  config.showBleed ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Gutter (mm)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-studio-text-muted block mb-1">Horizontal</label>
            <input
              type="number"
              value={config.gutterH}
              min={0} max={10} step={0.5}
              onChange={(e) => setConfig({ gutterH: Number(e.target.value) })}
              className="w-full bg-studio-card border border-studio-border rounded-lg px-3 py-2 text-sm text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
            />
          </div>
          <div>
            <label className="text-xs text-studio-text-muted block mb-1">Vertical</label>
            <input
              type="number"
              value={config.gutterV}
              min={0} max={10} step={0.5}
              onChange={(e) => setConfig({ gutterV: Number(e.target.value) })}
              className="w-full bg-studio-card border border-studio-border rounded-lg px-3 py-2 text-sm text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
