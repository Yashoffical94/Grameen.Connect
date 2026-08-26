import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-background',
    secondary: 'bg-surface2 hover:bg-border text-text border border-border',
    danger: 'bg-danger hover:bg-red-700 text-white',
    ghost: 'hover:bg-surface2 text-text',
    outline: 'border border-primary text-primary hover:bg-primary/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </button>
  );
};

export default Button;
