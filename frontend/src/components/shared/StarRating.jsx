import { Star } from 'lucide-react';

const StarRating = ({ rating, showNumber = true, size = 'sm' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {showNumber && (
        <span className="font-semibold text-text">{rating.toFixed(1)}</span>
      )}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={sizes[size]}
            className={
              star <= Math.round(rating)
                ? 'fill-accent text-accent'
                : 'text-text-muted'
            }
          />
        ))}
      </div>
    </div>
  );
};

export default StarRating;
