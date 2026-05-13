'use client';
import { useQueueStore } from '@/stores/queue.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Trash2, Play } from 'lucide-react';
import Link from 'next/link';

export default function BatchPage() {
  const { items, clearCompleted } = useQueueStore();

  const pending = items.filter((i) => i.status === 'pending').length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const failed = items.filter((i) => i.status === 'failed').length;

  return (
    <div className="min-h-screen bg-studio-bg text-studio-text p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <Button size="icon" variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Batch Processing Queue</h1>
            <p className="text-sm text-studio-text-muted">{pending} pending · {completed} done · {failed} failed</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-studio-text-muted">Queue is empty</p>
            <Link href="/" className="mt-4">
              <Button variant="primary">Go to Studio</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-studio-card border border-studio-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.personName}</p>
                    <p className="text-xs text-studio-text-muted mt-0.5">ID: {item.personId}</p>
                  </div>
                  <Badge
                    variant={
                      item.status === 'completed' ? 'success'
                      : item.status === 'failed' ? 'danger'
                      : item.status === 'processing' ? 'warning'
                      : 'default'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                {item.status === 'processing' && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-studio-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-studio-accent transition-all duration-300 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {item.error && (
                  <p className="text-xs text-studio-danger mt-2">{item.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {completed > 0 && (
          <Button variant="ghost" size="sm" className="mt-6" onClick={clearCompleted}>
            <Trash2 className="h-3.5 w-3.5" /> Clear completed
          </Button>
        )}
      </div>
    </div>
  );
}
