import { Skeleton } from "@/components/ui/skeleton";

export default function VaultLoading() {
  return (
    <main className="mx-auto mt-20 max-w-5xl px-6 pt-8 pb-20">
      {/* Header */}
      <div className="mb-10">
        <Skeleton className="h-9 w-36 rounded-lg bg-white/5" />
        <Skeleton className="mt-2 h-4 w-72 rounded bg-white/5" />
      </div>

      {/* Grid of vault card skeletons */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border border-gray-700/50 bg-[#1a1a1a] p-5"
          >
            {/* Top row: Icon + Content + Delete */}
            <div className="mb-4 flex items-start gap-3">
              {/* Icon */}
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl bg-white/5" />
              {/* Content */}
              <div className="min-w-0 flex-1">
                {/* Type tag */}
                <Skeleton className="mb-1.5 h-5 w-16 rounded-md bg-white/5" />
                {/* Title */}
                <Skeleton className="mb-1 h-4 w-4/5 rounded bg-white/5" />
                {/* Filename */}
                <Skeleton className="h-3 w-3/5 rounded bg-white/5" />
              </div>
              {/* Delete button */}
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg bg-white/5" />
            </div>

            {/* Meta row */}
            <div className="mb-5 flex items-center gap-3">
              <Skeleton className="h-3.5 w-24 rounded bg-white/5" />
              <Skeleton className="h-3 w-px bg-gray-700" />
              <Skeleton className="h-3.5 w-16 rounded bg-white/5" />
              <Skeleton className="h-3 w-px bg-gray-700" />
              <Skeleton className="h-3.5 w-16 rounded bg-white/5" />
            </div>

            {/* Action button */}
            <div className="mt-auto">
              <Skeleton className="h-9 w-full rounded-xl bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
