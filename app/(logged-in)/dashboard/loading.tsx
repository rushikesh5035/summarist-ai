import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="relative mt-20 min-h-screen overflow-hidden bg-[#111111] text-gray-300">
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-20">
        {/* Mode selector skeleton */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-56 rounded-full bg-white/5" />
          <div className="flex gap-4">
            <Skeleton className="h-28 w-40 rounded-2xl bg-white/5" />
            <Skeleton className="h-28 w-40 rounded-2xl bg-white/5" />
          </div>
        </div>

        {/* Drop zone skeleton */}
        <Skeleton className="mx-auto h-56 w-full max-w-2xl rounded-2xl bg-white/5" />

        {/* Submit button skeleton */}
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-11 w-40 rounded-xl bg-white/5" />
        </div>

        {/* Feature highlights skeleton */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl bg-white/5" />
          ))}
        </div>
      </main>
    </div>
  );
}
