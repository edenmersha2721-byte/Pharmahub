import { Skeleton } from "@/components/ui/skeleton";


export default function ResultCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-foreground/5 bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-16" />
      <div className="border-t border-foreground/5 pt-3">
        <Skeleton className="mb-2 h-4 w-28" />
        <Skeleton className="h-3 w-40" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
