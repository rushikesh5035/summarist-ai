"use client";
import React from "react";
import UploadFormInput from "@/components/upload/UploadFormInput";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

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
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("upload successfully!");
    },
    onUploadError: (err) => {
      toast("error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begin for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // validating the fields
    const validatedFeilds = schema.safeParse({ file });

    if (!validatedFeilds.success) {
      const errorMessage =
        validatedFeilds.error.flatten().fieldErrors.file?.[0] ?? "Invalid file";
      toast("Something went wrong", {
        description: errorMessage,
      });
      return;
    }

    toast("📄 Uploading PDF", {
      description: "We are uploading your PDF!",
    });

    // schema with zod

    // upload file to uploadthing
    const resp = await startUpload([file]);
    if (!resp) {
      toast("❌ Something went wrong", {
        description: "Please use a different file",
      });
      return;
    }

    toast("📄 Processing PDF", {
      description: "Hang tight! Our AI is reading through your document! ✨",
    });

    // parse the pdf using lang chain
    const summary = await generatePdfSummary(resp);
    // console.log({ summary });

    // summarize the PDF using AI
    // save the summary to the DB
    // redirect to the [id] summary page
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
};

export default UploadForm;
