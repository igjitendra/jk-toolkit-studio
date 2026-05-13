'use client';
import { UserPlus, Zap } from 'lucide-react';
import { usePersonsStore } from '@/stores/persons.store';
import { usePhotoProcessor } from '@/hooks/usePhotoProcessor';
import { useLayoutEngine } from '@/hooks/useLayoutEngine';
import { PersonCard } from '@/components/PersonCard';
import { Button } from '@/components/ui/Button';

export function PersonList() {
  const { persons, selectedPersonId, addPerson, setSelectedPerson } = usePersonsStore();
  const { processAll } = usePhotoProcessor();
  const { generateLayout } = useLayoutEngine();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-studio-border flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-studio-text">People</h2>
          <p className="text-xs text-studio-text-muted">{persons.length} added</p>
        </div>
        <Button size="sm" variant="primary" onClick={addPerson}>
          <UserPlus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {persons.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="h-12 w-12 rounded-2xl bg-studio-card border border-studio-border flex items-center justify-center mb-3">
              <UserPlus className="h-5 w-5 text-studio-text-muted" />
            </div>
            <p className="text-sm text-studio-text-muted">No people added yet</p>
            <p className="text-xs text-studio-text-muted mt-1">Click Add to start</p>
          </div>
        ) : (
          persons.map((p) => (
            <PersonCard
              key={p.id}
              person={p}
              isSelected={selectedPersonId === p.id}
              onSelect={() => setSelectedPerson(p.id)}
            />
          ))
        )}
      </div>

      {/* Footer Actions */}
      {persons.length > 0 && (
        <div className="p-3 border-t border-studio-border space-y-2 flex-shrink-0">
          <Button size="sm" variant="secondary" className="w-full" onClick={processAll}>
            <Zap className="h-3.5 w-3.5" />
            Process All Photos
          </Button>
          <Button size="sm" variant="primary" className="w-full" onClick={generateLayout}>
            Generate Sheet Layout
          </Button>
        </div>
      )}
    </div>
  );
}
