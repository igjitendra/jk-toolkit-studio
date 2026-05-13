'use client';
import { useRef } from 'react';
import { Trash2, Upload, User, ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { usePersonsStore } from '@/stores/persons.store';
import { usePhotoProcessor } from '@/hooks/usePhotoProcessor';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PHOTO_SIZES } from '@/constants/photo-sizes';
import type { Person } from '@/types';

interface PersonCardProps {
  person: Person;
  isSelected: boolean;
  onSelect: () => void;
}

export function PersonCard({ person, isSelected, onSelect }: PersonCardProps) {
  const { updatePerson, removePerson } = usePersonsStore();
  const { processPhoto } = usePhotoProcessor();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updatePerson(person.id, {
        photoFile: file,
        photoDataUrl: dataUrl,
        processingStatus: 'idle',
        processedDataUrl: undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  const statusColor = {
    idle: 'default',
    processing: 'warning',
    done: 'success',
    error: 'danger',
  } as const;

  const thumb = person.processedDataUrl ?? person.photoDataUrl;

  return (
    <div
      onClick={onSelect}
      className={clsx(
        'group relative rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden',
        isSelected
          ? 'border-studio-accent bg-studio-card shadow-lg shadow-studio-accent/10'
          : 'border-studio-border bg-studio-surface hover:border-studio-muted hover:bg-studio-card'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <div className="h-14 w-11 rounded-lg overflow-hidden bg-studio-muted flex-shrink-0 flex items-center justify-center">
          {thumb ? (
            <img src={thumb} alt={person.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-5 w-5 text-studio-text-muted" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <input
            value={person.name}
            onChange={(e) => updatePerson(person.id, { name: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent text-sm font-medium text-studio-text focus:outline-none border-b border-transparent focus:border-studio-accent/50 pb-0.5 truncate"
            placeholder="Person name"
          />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-studio-text-muted">{person.size.label}</span>
            <span className="text-studio-border">·</span>
            <span className="text-xs text-studio-text-muted">Qty: {person.quantity}</span>
          </div>
        </div>

        {/* Status + Actions */}
        <div className="flex flex-col items-end gap-2">
          <Badge variant={statusColor[person.processingStatus]}>
            {person.processingStatus === 'processing' ? (
              <span className="h-2.5 w-2.5 animate-spin rounded-full border border-current border-t-transparent mr-1" />
            ) : null}
            {person.processingStatus}
          </Badge>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              title="Upload photo"
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); removePerson(person.id); }}
              title="Remove"
              className="hover:text-studio-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Process button (shows when photo uploaded but not processed) */}
      {person.photoDataUrl && person.processingStatus === 'idle' && (
        <div className="px-3 pb-3">
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            onClick={(e) => { e.stopPropagation(); processPhoto(person.id); }}
          >
            Auto-process (face + bg)
          </Button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
