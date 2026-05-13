'use client';
import { useState } from 'react';
import { useUIStore } from '@/stores/ui.store';
import { TopToolbar } from '@/components/TopToolbar';
import { PersonList } from '@/components/PersonList';
import { SheetPreview } from '@/components/SheetPreview';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { SheetSettingsPanel } from '@/components/SheetSettingsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { Menu, Settings, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function StudioPage() {
  const { rightPanel, setRightPanel, isMobileSidebarOpen, setMobileSidebar, isMobileRightOpen, setMobileRight } = useUIStore();

  return (
    <div className="flex flex-col h-screen bg-studio-bg overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar />

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR — People List */}
        <aside
          className={[
            'flex-shrink-0 bg-studio-surface border-r border-studio-border overflow-hidden',
            'w-72',
            // Mobile: overlay
            'fixed inset-y-12 left-0 z-40 lg:relative lg:inset-auto lg:z-auto',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            'transition-transform duration-200',
          ].join(' ')}
        >
          <PersonList />
        </aside>

        {/* Mobile sidebar toggle */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-20 left-2 z-50 lg:hidden shadow-lg bg-studio-card border border-studio-border"
          onClick={() => setMobileSidebar(!isMobileSidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* CENTER — Sheet Preview */}
        <main className="flex-1 overflow-hidden">
          <SheetPreview />
        </main>

        {/* RIGHT SIDEBAR — Properties / Settings */}
        <aside
          className={[
            'flex-shrink-0 bg-studio-surface border-l border-studio-border overflow-hidden',
            'w-72',
            // Mobile: overlay from right
            'fixed inset-y-12 right-0 z-40 lg:relative lg:inset-auto lg:z-auto',
            isMobileRightOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
            'transition-transform duration-200',
          ].join(' ')}
        >
          {/* Right panel tabs */}
          <div className="flex border-b border-studio-border">
            <button
              onClick={() => setRightPanel('properties')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                rightPanel === 'properties'
                  ? 'border-studio-accent text-studio-accent'
                  : 'border-transparent text-studio-text-muted hover:text-studio-text'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" /> Properties
            </button>
            <button
              onClick={() => setRightPanel('sheet')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                rightPanel === 'sheet'
                  ? 'border-studio-accent text-studio-accent'
                  : 'border-transparent text-studio-text-muted hover:text-studio-text'
              }`}
            >
              <Settings className="h-3.5 w-3.5" /> Sheet
            </button>
          </div>

          <div className="overflow-y-auto" style={{ height: 'calc(100% - 44px)' }}>
            {rightPanel === 'properties' ? <PropertiesPanel /> : <SheetSettingsPanel />}
          </div>
        </aside>

        {/* Mobile right toggle */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-20 right-2 z-50 lg:hidden shadow-lg bg-studio-card border border-studio-border"
          onClick={() => setMobileRight(!isMobileRightOpen)}
        >
          <Sliders className="h-4 w-4" />
        </Button>
      </div>

      {/* BOTTOM — Export Bar */}
      <footer className="flex-shrink-0 bg-studio-surface border-t border-studio-border">
        <ExportPanel />
      </footer>
    </div>
  );
}
