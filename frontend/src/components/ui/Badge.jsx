const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface2 text-text-muted',
    success: 'bg-primary/20 text-primary',
    warning: 'bg-accent/20 text-accent',
    danger: 'bg-danger/20 text-danger',
    info: 'bg-blue/20 text-blue',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
