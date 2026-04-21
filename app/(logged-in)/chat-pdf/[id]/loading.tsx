import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPdfLoading() {
  return (
    <main className="mx-auto mt-15 h-[calc(100dvh-60px)] max-w-5xl overflow-hidden px-6 py-4">
      <div className="flex h-full flex-col">
        {/* File badge */}
        <div className="mb-4 flex justify-center">
          <Skeleton className="h-8 w-52 rounded-full bg-white/5" />
        </div>

        {/* Messages area */}
        <div className="flex-1 space-y-4 overflow-hidden py-2">
          {/* AI message */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md bg-white/5" />
            <Skeleton className="h-16 w-60 rounded-2xl bg-white/5" />
          </div>
          {/* User message */}
          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-44 rounded-2xl bg-white/5" />
            <Skeleton className="h-8 w-8 shrink-0 rounded-md bg-white/5" />
          </div>
          {/* AI message */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md bg-white/5" />
            <Skeleton className="h-20 w-80 rounded-2xl bg-white/5" />
          </div>
        </div>

        {/* Input box */}
        <div className="mt-3 shrink-0">
          <Skeleton className="h-20 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    </main>
  );
}
