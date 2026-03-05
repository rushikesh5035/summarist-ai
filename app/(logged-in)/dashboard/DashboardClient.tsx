"use client";

import Link from "next/link";

import { ArrowRight, Plus } from "lucide-react";
import { motion } from "motion/react";

import EmptySummaryState from "@/components/summaries/EmptySummaryState";
import SummaryCard from "@/components/summaries/SummaryCard";
import { Button } from "@/components/ui/button";

interface DashboardClientProps {
  summaries: any[];
  hasReachedLimit: boolean;
  uploadLimit: number;
}

export default function DashboardClient({
  summaries,
  hasReachedLimit,
  uploadLimit,
}: DashboardClientProps) {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-16">
          <div className="mb-8 flex justify-between gap-4">
            <div className="flex flex-col gap-2">
              <motion.h1
                initial="hidden"
                whileInView="visible"
                className="bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent"
              >
                Your Summaries
              </motion.h1>
              <motion.p
                initial="hidden"
                animate="visible"
                className="text-gray-600"
              >
                Transform your PDFs into concise, actionable insights
              </motion.p>
            </div>

            {!hasReachedLimit && (
              <motion.div
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  variant={"link"}
                  className="group bg-linear-to-r from-rose-500 to-rose-700 transition-all duration-300 hover:scale-105 hover:from-rose-600 hover:to-rose-800 hover:no-underline"
                >
                  <Link href="/upload" className="flex items-center text-white">
                    <Plus className="mr-2 h-5 w-5" />
                    New Summary
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>

          {hasReachedLimit && (
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="mb-6"
            >
              <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <p className="text-sm">
                  You've reached the limit of {uploadLimit} upload on the Basic
                  plan.{" "}
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center font-medium text-rose-800 underline underline-offset-4"
                  >
                    Click here to upgrade to Pro{" "}
                    <ArrowRight className="inline-block h-4 w-4" />
                  </Link>{" "}
                  for unlimited uploads.
                </p>
              </div>
            </motion.div>
          )}

          {summaries.length === 0 ? (
            <EmptySummaryState />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3"
            >
              {summaries.map((summary, index) => (
                <SummaryCard key={index} summary={summary} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
