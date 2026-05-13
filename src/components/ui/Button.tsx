import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-studio-accent/50 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-studio-accent text-white hover:bg-studio-accent-hover active:scale-95': variant === 'primary',
            'bg-studio-card text-studio-text hover:bg-studio-muted border border-studio-border active:scale-95': variant === 'secondary',
            'text-studio-text-muted hover:text-studio-text hover:bg-studio-card active:scale-95': variant === 'ghost',
            'bg-studio-danger text-white hover:opacity-90 active:scale-95': variant === 'danger',
            'bg-studio-success text-white hover:opacity-90 active:scale-95': variant === 'success',
          },
          {
            'h-7 px-2.5 text-xs': size === 'sm',
            'h-9 px-4 text-sm': size === 'md',
            'h-11 px-6 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
