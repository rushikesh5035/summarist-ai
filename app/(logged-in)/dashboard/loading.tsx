import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const HeaderSkeleton = () => {
  return (
    <div className="mb-8 flex justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

const SummaryCardSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground rounded-md border shadow-sm">
      <Skeleton className="h-48 w-full rounded-md" />
    </div>
  );
};

const loadingSummaries = () => {
  return (
    <div className="relative min-h-screen">
      <section className="container mx-auto flex flex-col gap-4 px-10 py-24">
        <HeaderSkeleton />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SummaryCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default loadingSummaries;
