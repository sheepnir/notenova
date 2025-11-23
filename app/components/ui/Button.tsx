import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-[var(--color-violet-primary)] text-white hover:bg-[var(--color-violet-hover)] hover:shadow-[var(--glow-violet)] active:scale-98',
      secondary: 'border border-[var(--color-lavender-border)] text-[var(--color-lavender-border)] hover:bg-[rgba(124,58,237,0.1)] active:scale-98',
      ghost: 'text-[var(--color-white-primary)] hover:bg-[rgba(255,255,255,0.05)] active:scale-98',
      danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-light)] active:scale-98',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
