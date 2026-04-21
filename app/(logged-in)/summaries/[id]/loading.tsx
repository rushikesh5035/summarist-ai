import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryLoading() {
  return (
    <main className="mx-auto mt-20 max-w-5xl px-6 pt-8 pb-20">
      {/* Heading + toolbar */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="mb-3 h-8 w-2/3 rounded-lg bg-white/5" />
          <div className="flex gap-3">
            <Skeleton className="h-5 w-24 rounded-full bg-white/5" />
            <Skeleton className="h-5 w-20 rounded-full bg-white/5" />
            <Skeleton className="h-5 w-28 rounded-full bg-white/5" />
          </div>
        </div>
        {/* Export button group */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg bg-white/5" />
          <Skeleton className="h-9 w-9 rounded-lg bg-white/5" />
          <Skeleton className="h-9 w-9 rounded-lg bg-white/5" />
        </div>
      </div>

      {/* Overview panel */}
      <Skeleton className="mb-6 h-28 w-full rounded-2xl bg-white/5" />

      {/* Key points panel */}
      <div className="mb-6 rounded-2xl border border-gray-800/60 bg-[#1a1a1a] p-6">
        <Skeleton className="mb-4 h-5 w-28 rounded bg-white/5" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded bg-white/5" />
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl bg-white/5" />
        ))}
      </div>
    </main>
  );
}
