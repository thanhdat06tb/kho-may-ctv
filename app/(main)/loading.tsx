import { Skeleton } from "@/components/ui/skeleton";

export default function MainLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-64 max-w-[78vw]" />
        </div>
        <Skeleton className="h-11 w-24" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    </div>
  );
}
