import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

const FeedSkeleton = ({ cols = 3, count = 9 }) => {
  const skeletons = Array.from({ length: count });
  const gridColsClass = `lg:grid-cols-${cols}`;

  return (
    <div className={`my-3 grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-6`}>
      {skeletons.map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-60" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
};


export { Skeleton, FeedSkeleton }
