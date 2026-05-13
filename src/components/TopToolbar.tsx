'use client';
import { Layers, Settings, FolderOpen, Save, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

export function TopToolbar() {
  return (
    <header className="flex items-center justify-between px-4 h-12 border-b border-studio-border bg-studio-surface flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-studio-accent flex items-center justify-center">
          <Layers className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-studio-text">JK Toolkit Studio</span>
          <span className="ml-2 text-xs text-studio-text-muted hidden sm:inline">Universal Photo Sheet Generator</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Tooltip content="Open Project">
          <Button size="icon" variant="ghost">
            <FolderOpen className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Save Project">
          <Button size="icon" variant="ghost">
            <Save className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Settings">
          <Button size="icon" variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}
