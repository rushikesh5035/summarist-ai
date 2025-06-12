import React from "react";
import BgGradient from "@/components/common/BgGradient";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/common/motion-wrapper";
import {
  buttonVarient,
  containerVarient,
  itemVarient,
} from "@/utils/constants";

const UpgradeRequired = () => {
  return (
    <div className="relative min-h-[50vh]">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <MotionDiv
        variants={containerVarient}
        initial="hidden"
        animate="visible"
        className="container px-8 py-16"
      >
        <div className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto">
          <MotionDiv
            variants={itemVarient}
            className="flex items-center gap-2 text-rose-500"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Premium Feature
            </span>
          </MotionDiv>

          <MotionH1
            variants={itemVarient}
            className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          >
            Subscription Required
          </MotionH1>

          <MotionP
            variants={itemVarient}
            className="text-lg leading-8 text-gray-600 border-2 border-rose-200 bg-white/50 backdrop-blur-xs rounded-lg p-6 border-dashed max-w-xl"
          >
            You need to upgrade to the Basic Plan or the Pro plan to access this
            feature
          </MotionP>

          <MotionDiv variants={itemVarient} whileHover={buttonVarient}>
            <Button
              asChild
              className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white"
            >
              <Link href="/#pricing" className="flex gap-2 items-center">
                View Pricing Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </MotionDiv>
        </div>
      </MotionDiv>
    </div>
  );
};

export default UpgradeRequired;
