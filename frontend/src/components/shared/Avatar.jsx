const Avatar = ({ src, name, size = 'md', verified = false, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const getColorIndex = (name) => {
    if (!name) return 0;
    return name.length % colors.length;
  };

  if (src) {
    return (
      <div className={`relative inline-block ${className}`}>
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover border-2 border-border`}
        />
        {verified && (
          <span className="absolute bottom-0 right-0 bg-primary text-background rounded-full p-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizes[size]} ${colors[getColorIndex(name)]} rounded-full flex items-center justify-center font-semibold text-white border-2 border-border`}
      >
        {getInitials(name)}
      </div>
      {verified && (
        <span className="absolute bottom-0 right-0 bg-primary text-background rounded-full p-0.5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default Avatar;
