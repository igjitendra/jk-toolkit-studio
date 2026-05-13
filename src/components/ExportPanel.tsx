'use client';
import { useState } from 'react';
import { Download, FileImage, FileText, Archive, Printer } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { useSheetStore } from '@/stores/sheet.store';
import { Button } from '@/components/ui/Button';
import type { ExportFormat } from '@/types';

export function ExportPanel() {
  const { doExport, isExporting, progress } = useExport();
  const { layouts, config } = useSheetStore();
  const [format, setFormat] = useState<ExportFormat>('jpg');
  const [quality, setQuality] = useState(0.92);

  const exportButtons: { format: ExportFormat; icon: React.ReactNode; label: string }[] = [
    { format: 'jpg', icon: <FileImage className="h-4 w-4" />, label: 'JPG' },
    { format: 'png', icon: <FileImage className="h-4 w-4" />, label: 'PNG' },
    { format: 'pdf', icon: <FileText className="h-4 w-4" />, label: 'PDF' },
    { format: 'zip', icon: <Archive className="h-4 w-4" />, label: 'ZIP' },
  ];

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Format tabs */}
      <div className="flex gap-1 bg-studio-surface rounded-lg p-1 border border-studio-border">
        {exportButtons.map((btn) => (
          <button
            key={btn.format}
            onClick={() => setFormat(btn.format)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              format === btn.format
                ? 'bg-studio-accent text-white'
                : 'text-studio-text-muted hover:text-studio-text'
            }`}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>

      {/* DPI indicator */}
      <span className="text-xs text-studio-text-muted">{config.dpi} DPI</span>

      {/* Export button */}
      <Button
        variant="primary"
        size="md"
        loading={isExporting}
        disabled={layouts.length === 0}
        onClick={() => doExport({
          format,
          quality,
          dpi: config.dpi,
          includeAllSheets: true,
        })}
      >
        <Download className="h-4 w-4" />
        {isExporting ? `Exporting ${progress}%` : `Export ${format.toUpperCase()}`}
      </Button>

      {/* Print button */}
      <Button variant="secondary" size="md" disabled={layouts.length === 0}>
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
}
