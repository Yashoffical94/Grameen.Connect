export const CardSkeleton = () => (
  <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-full skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full skeleton rounded" />
      <div className="h-3 w-5/6 skeleton rounded" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 skeleton rounded-full" />
      <div className="h-6 w-16 skeleton rounded-full" />
      <div className="h-6 w-16 skeleton rounded-full" />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
