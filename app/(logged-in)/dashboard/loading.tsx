import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="relative mt-20 min-h-screen overflow-hidden bg-[#111111] text-gray-300">
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-20">
        {/* Hero skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-5 h-8 w-56 rounded-full bg-[#0CF2A0]/10" />
          <Skeleton className="mx-auto mb-3 h-12 w-full max-w-xl rounded-lg bg-white/8" />
          <Skeleton className="mx-auto mb-4 h-12 w-full max-w-md rounded-lg bg-[#0CF2A0]/12" />
          <Skeleton className="mx-auto mb-2 h-5 w-full max-w-lg rounded-md bg-white/6" />
          <Skeleton className="mx-auto h-5 w-full max-w-md rounded-md bg-white/6" />
        </div>

        {/* Drop zone skeleton */}
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-gray-700/70 bg-[#1a1a1a]/40 p-6 text-center sm:p-5">
          <Skeleton className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-[#0CF2A0]/12" />
          <Skeleton className="mx-auto mb-2 h-8 w-60 rounded-md bg-white/8" />
          <Skeleton className="mx-auto mb-4 h-5 w-52 rounded-md bg-white/6" />
          <Skeleton className="mx-auto h-8 w-44 rounded-md bg-white/6" />
        </div>

        {/* Feature highlights skeleton */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-800 bg-[#1a1a1a]/60 p-3"
            >
              <Skeleton className="mx-auto mb-3 h-10 w-10 rounded-md bg-white/8" />
              <Skeleton className="mx-auto mb-2 h-5 w-24 rounded-md bg-white/8" />
              <Skeleton className="mx-auto h-4 w-36 rounded-md bg-white/6" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
