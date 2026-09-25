const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`
        glass rounded-2xl p-5
        ${hover ? 'glass-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
