const shimmer = "animate-pulse bg-white/10";

const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <span className={`${shimmer} h-6 w-28 rounded-full`} />
        <span className={`${shimmer} h-6 w-16 rounded-full`} />
      </div>

      <div className="mt-5 space-y-3">
        <div className={`${shimmer} h-7 w-3/4 rounded-lg`} />
        <div className={`${shimmer} h-4 w-full rounded-lg`} />
        <div className={`${shimmer} h-4 w-4/5 rounded-lg`} />
      </div>

      <div className="mt-6 space-y-3">
        <div className={`${shimmer} h-4 w-1/2 rounded-lg`} />
        <div className={`${shimmer} h-4 w-1/3 rounded-lg`} />
        <div className={`${shimmer} h-4 w-2/3 rounded-lg`} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className={`${shimmer} h-4 w-32 rounded-lg`} />
        <span className={`${shimmer} h-4 w-20 rounded-lg`} />
      </div>
    </div>
  );
};

export default EventCardSkeleton;
