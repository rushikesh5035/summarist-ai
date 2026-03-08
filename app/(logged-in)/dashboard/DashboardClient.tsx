"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import LoadingView from "@/components/dashboard/LoadingView";
import UploadPage from "@/components/dashboard/UploadPage";
import { useUploadThing } from "@/utils/uploadthing";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 32 * 1024 * 1024,
      "File size must be less than 32MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

type Mode = "summary" | "chat" | null;
type View = "upload" | "loading" | "summary" | "chat";

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
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [view, setView] = useState<View>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("upload successfully!");
    },
    onUploadError: (err) => {
      toast("error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async () => {
    if (!file || !mode) return;

    if (mode === "summary") {
      // Validate file before uploading
      const validatedFields = schema.safeParse({ file });
      if (!validatedFields.success) {
        const errorMessage =
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file";
        toast("❌ Something went wrong", { description: errorMessage });
        return;
      }

      setView("loading");

      try {
        toast("📄 Uploading PDF", {
          description: "We are uploading your PDF!",
        });

        // Upload file to UploadThing
        const resp = await startUpload([file]);
        if (!resp) {
          toast("❌ Something went wrong", {
            description: "Please use a different file",
          });
          setView("upload");
          return;
        }

        toast("📄 Processing PDF", {
          description: "Our AI is reading through your document! ✨",
        });

        // Parse PDF and generate summary with AI
        const result = await generatePdfSummary([
          {
            serverData: {
              userId: resp[0].serverData.userId,
              file: {
                ufsUrl: resp[0].serverData.file.ufsUrl,
                name: resp[0].serverData.file.name,
              },
            },
          },
        ]);

        const { data = null, message = null } = result || {};

        if (data?.summary) {
          toast("📄 Saving PDF...", {
            description: "We are saving your summary! ✨",
          });

          // Save summary to the database
          const storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: resp[0].serverData.file.ufsUrl,
            title: data.title,
            fileName: file.name,
          });

          toast("✨ Summary Generated!", {
            description: "Your PDF has been successfully summarized and saved",
          });

          // Redirect to the summary page
          if (storeResult.data) {
            router.push(`/summaries/${storeResult.data.id}`);
          }
        } else {
          toast("❌ Something went wrong", {
            description: message || "Failed to generate summary.",
          });
          setView("upload");
        }
      } catch (error) {
        console.error("Error occurred", error);
        toast("❌ Something went wrong", {
          description: "An unexpected error occurred. Please try again.",
        });
        setView("upload");
      }
    } else if (mode === "chat") {
      setView("chat");
    }
  };

  return (
    <div className="relative mt-20 min-h-screen overflow-hidden bg-[#111111] text-gray-300">
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-20">
        <AnimatePresence mode="wait">
          <>
            {view === "upload" && (
              <UploadPage
                key="upload"
                file={file}
                mode={mode}
                isDragging={isDragging}
                onFileSelect={setFile}
                onModeChange={setMode}
                onDragStateChange={setIsDragging}
                onSubmit={handleSubmit}
                hasReachedLimit={hasReachedLimit}
                uploadLimit={uploadLimit}
              />
            )}
            {view === "loading" && (
              <LoadingView
                key="loading"
                fileName={file?.name || ""}
                onComplete={() => {}}
              />
            )}
          </>
        </AnimatePresence>
      </main>
    </div>
  );
}
