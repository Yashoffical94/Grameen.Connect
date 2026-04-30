const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`
        bg-surface border border-border rounded-xl p-5
        ${hover ? 'hover:border-primary/30 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
