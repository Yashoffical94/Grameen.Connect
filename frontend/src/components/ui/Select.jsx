const Select = ({
  label,
  error,
  options = [],
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
      <select
        className={`
          w-full bg-surface border rounded-lg px-4 py-2.5 text-text
          focus:outline-none focus:ring-1 transition-colors [&>option]:bg-surface
          ${error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-primary focus:ring-primary'}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Select;
