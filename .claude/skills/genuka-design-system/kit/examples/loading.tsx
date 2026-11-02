// Example: app/(app)/customers/loading.tsx, shown while a list page loads: the page's shape in Skeletons,
// never a blank screen. (The dashboard also has a full-screen loading page; inside the iframe a skeleton is lighter.)
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div aria-busy className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-[72px] w-full rounded-md" />
      <div className="overflow-hidden rounded-lg ring-1 ring-slate-200/60">
        <Skeleton className="h-16 w-full rounded-none" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-dashed border-slate-200 px-5 py-4">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-24 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
