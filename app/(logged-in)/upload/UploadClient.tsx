"use client";

import { motion } from "motion/react";

import UploadForm from "@/components/upload/UploadForm";
import UploadHeader from "@/components/upload/UploadHeader";
import { containerVarient } from "@/utils/constants";

export default function UploadClient() {
  return (
    <section className="min-h-screen">
      <motion.div
        variants={containerVarient}
        initial="hidden"
        animate="visible"
        className="py24 mx-auto max-w-7xl px-6 sm:py-32 lg:px-8"
      >
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <UploadHeader />
          <UploadForm />
        </div>
      </motion.div>
    </section>
  );
}
