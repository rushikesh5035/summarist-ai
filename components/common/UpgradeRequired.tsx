"use client";

import React from "react";

import Link from "next/link";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { containerVarient } from "@/utils/constants";

const UpgradeRequired = () => {
  return (
    <div className="relative min-h-[50vh]">
      <motion.div
        variants={containerVarient}
        initial="hidden"
        animate="visible"
        className="container px-8 py-16"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 text-center">
          <motion.div className="flex items-center gap-2 text-rose-500">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Premium Feature
            </span>
          </motion.div>

          <motion.h1 className="bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Subscription Required
          </motion.h1>

          <motion.p className="max-w-xl rounded-lg border-2 border-dashed border-rose-200 bg-white/50 p-6 text-lg leading-8 text-gray-600 backdrop-blur-xs">
            You need to upgrade to the Basic Plan or the Pro plan to access this
            feature
          </motion.p>

          <motion.div>
            <Button
              asChild
              className="bg-linear-to-r from-rose-500 to-rose-700 text-white hover:from-rose-600 hover:to-rose-800"
            >
              <Link href="/#pricing" className="flex items-center gap-2">
                View Pricing Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradeRequired;
