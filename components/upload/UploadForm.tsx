"use client";
import React, { useRef, useState } from "react";
import UploadFormInput from "@/components/upload/UploadFormInput";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File Size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

const UploadForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("upload successfully!");
    },
    onUploadError: (err) => {
      toast("error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: (file) => {
      console.log("upload has begin for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // validating the fields
      const validatedFeilds = schema.safeParse({ file });

      if (!validatedFeilds.success) {
        const errorMessage =
          validatedFeilds.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file";
        toast("❌ Something went wrong", {
          description: errorMessage,
        });
        setIsLoading(false);
        return;
      }

      toast("📄 Uploading PDF", {
        description: "We are uploading your PDF!",
      });

      // upload file to uploadthing
      const resp = await startUpload([file]);
      if (!resp) {
        toast("❌ Something went wrong", {
          description: "Please use a different file",
        });
        setIsLoading(false);
        return;
      }

      toast("📄 Processing PDF", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      // parse the pdf using lang chain and summarize the PDF using AI
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

      if (data) {
        let storeResult: any;
        toast("📄 Saving PDF...", {
          description: "We are saving your summary!✨",
        });

        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: resp[0].serverData.file.ufsUrl,
            title: data.title,
            fileName: file.name,
          });

          toast("✨ Summary Generated!", {
            description: "Your PDF has been successfully summarized and saved",
          });

          formRef.current?.reset();
          setIsLoading(false);
          // redirect to the [id] summary page
          router.push(`/summaries/${storeResult.data.id}`);
        }
      } else {
        toast("❌ Something went wrong", {
          description: message || "Failed to generate summary.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error occurred", error);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UploadForm;
