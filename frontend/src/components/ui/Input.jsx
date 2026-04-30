const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full bg-surface border rounded-lg px-4 py-2.5 text-text
          placeholder:text-text-muted
          focus:outline-none focus:ring-1 transition-colors
          ${error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-primary focus:ring-primary'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Input;
