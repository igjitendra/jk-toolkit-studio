import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        {
          'bg-studio-muted text-studio-text-muted': variant === 'default',
          'bg-studio-success/20 text-studio-success': variant === 'success',
          'bg-studio-warning/20 text-studio-warning': variant === 'warning',
          'bg-studio-danger/20 text-studio-danger': variant === 'danger',
          'bg-studio-accent/20 text-studio-accent': variant === 'accent',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
