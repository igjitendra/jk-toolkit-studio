'use client';
import { usePersonsStore } from '@/stores/persons.store';
import { PHOTO_SIZES_LIST, PHOTO_SIZES } from '@/constants/photo-sizes';
import { Button } from '@/components/ui/Button';
import type { BackgroundMode } from '@/types';

export function PropertiesPanel() {
  const { persons, selectedPersonId, updatePerson } = usePersonsStore();
  const person = persons.find((p) => p.id === selectedPersonId);

  if (!person) {
    return (
      <div className="flex items-center justify-center h-40 text-center px-4">
        <p className="text-xs text-studio-text-muted">Select a person to edit properties</p>
      </div>
    );
  }

  const BG_OPTIONS: { value: BackgroundMode; label: string; color: string }[] = [
    { value: 'white', label: 'White', color: '#ffffff' },
    { value: 'blue', label: 'Blue', color: '#4a90d9' },
    { value: 'red', label: 'Red', color: '#d94a4a' },
    { value: 'transparent', label: 'Transparent', color: 'transparent' },
  ];

  return (
    <div className="p-4 space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Photo Size</h3>
        <select
          value={person.size.preset}
          onChange={(e) => {
            const size = PHOTO_SIZES[e.target.value];
            if (size) updatePerson(person.id, { size });
          }}
          className="w-full bg-studio-card border border-studio-border rounded-lg px-3 py-2 text-sm text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
        >
          {PHOTO_SIZES_LIST.map((s) => (
            <option key={s.preset} value={s.preset}>{s.label}</option>
          ))}
        </select>
      </div>

      {person.size.preset === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-studio-text-muted block mb-1">Width (mm)</label>
            <input
              type="number"
              value={person.size.width}
              onChange={(e) => updatePerson(person.id, { size: { ...person.size, width: Number(e.target.value) } })}
              className="w-full bg-studio-card border border-studio-border rounded-lg px-3 py-2 text-sm text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
            />
          </div>
          <div>
            <label className="text-xs text-studio-text-muted block mb-1">Height (mm)</label>
            <input
              type="number"
              value={person.size.height}
              onChange={(e) => updatePerson(person.id, { size: { ...person.size, height: Number(e.target.value) } })}
              className="w-full bg-studio-card border border-studio-border rounded-lg px-3 py-2 text-sm text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => updatePerson(person.id, { quantity: Math.max(1, person.quantity - 1) })}
          >−</Button>
          <span className="text-lg font-semibold text-studio-text w-8 text-center">{person.quantity}</span>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => updatePerson(person.id, { quantity: Math.min(20, person.quantity + 1) })}
          >+</Button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider mb-3">Background</h3>
        <div className="grid grid-cols-4 gap-2">
          {BG_OPTIONS.map((bg) => (
            <button
              key={bg.value}
              onClick={() => updatePerson(person.id, { background: bg.value })}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                person.background === bg.value
                  ? 'border-studio-accent bg-studio-accent/10'
                  : 'border-studio-border hover:border-studio-muted'
              }`}
            >
              <div
                className="h-7 w-7 rounded-md border border-studio-border"
                style={{ background: bg.color === 'transparent' ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 0 0/8px 8px' : bg.color }}
              />
              <span className="text-xs text-studio-text-muted">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
