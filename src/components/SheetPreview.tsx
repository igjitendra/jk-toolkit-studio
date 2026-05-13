'use client';
import { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { usePersonsStore } from '@/stores/persons.store';
import { useSheetStore } from '@/stores/sheet.store';
import { useUIStore } from '@/stores/ui.store';
import { renderSheetToCanvas } from '@/modules/export/sheet-renderer';
import { Button } from '@/components/ui/Button';
import { PAPER_DIMENSIONS } from '@/constants/paper-sizes';

export function SheetPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { persons } = usePersonsStore();
  const { layouts, activeLayoutIndex, isGenerating, config } = useSheetStore();
  const { zoom, setZoom } = useUIStore();
  const [isRendering, setRendering] = useState(false);

  const activeLayout = layouts[activeLayoutIndex];

  useEffect(() => {
    if (!activeLayout || !canvasRef.current) return;
    setRendering(true);
    renderSheetToCanvas(activeLayout, persons, {
      dpi: 96,  // screen resolution for preview
      showCutGuides: config.showCutGuides,
      showBleed: config.showBleed,
      bleedSize: config.bleedSize,
      quality: 0.9,
    }).then((offCanvas) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !canvasRef.current) return;
      canvasRef.current.width = offCanvas.width;
      canvasRef.current.height = offCanvas.height;
      ctx.drawImage(offCanvas, 0, 0);
      setRendering(false);
    }).catch(() => setRendering(false));
  }, [activeLayout, persons, config]);

  const paper = PAPER_DIMENSIONS[config.paper];
  const aspectRatio = paper.height / paper.width;

  return (
    <div className="flex flex-col h-full bg-studio-bg">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-studio-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-studio-text-muted">
            {layouts.length > 0
              ? `Sheet ${activeLayoutIndex + 1} of ${layouts.length}`
              : 'No layout generated'}
          </span>
          {activeLayout && (
            <span className="text-xs text-studio-text-muted">
              — {(activeLayout.efficiency * 100).toFixed(0)}% filled
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => setZoom(zoom - 0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-studio-text-muted w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button size="icon" variant="ghost" onClick={() => setZoom(zoom + 0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8" style={{ background: '#1a1a1f' }}>
        {isGenerating || isRendering ? (
          <div className="flex flex-col items-center gap-3 text-studio-text-muted">
            <RefreshCw className="h-8 w-8 animate-spin text-studio-accent" />
            <p className="text-sm">{isGenerating ? 'Arranging photos...' : 'Rendering preview...'}</p>
          </div>
        ) : activeLayout ? (
          <div
            className="relative shadow-2xl"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <canvas
              ref={canvasRef}
              className="block"
              style={{ background: '#fff', maxWidth: '100%', display: 'block' }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center max-w-xs">
            <div
              className="border-2 border-dashed border-studio-border rounded-2xl flex items-center justify-center"
              style={{ width: 200, height: 200 * aspectRatio, background: '#fff1' }}
            >
              <span className="text-xs text-studio-text-muted">{config.paper} sheet</span>
            </div>
            <p className="text-sm text-studio-text-muted">
              Add people, upload photos, then click<br />
              <strong className="text-studio-text">Generate Sheet Layout</strong>
            </p>
          </div>
        )}
      </div>

      {/* Sheet Navigation */}
      {layouts.length > 1 && (
        <div className="flex items-center justify-center gap-2 p-3 border-t border-studio-border flex-shrink-0">
          {layouts.map((_, i) => (
            <button
              key={i}
              onClick={() => useSheetStore.getState().setActiveLayout(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === activeLayoutIndex ? 'bg-studio-accent' : 'bg-studio-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
