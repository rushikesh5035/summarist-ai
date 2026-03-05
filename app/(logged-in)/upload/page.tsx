import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { hasReachedUploadLimit } from "@/lib/user";

import UploadClient from "./UploadClient";

const Page = async () => {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const userId = user?.id;
  const { hasReachedLimit } = await hasReachedUploadLimit(userId);

  if (hasReachedLimit) {
    redirect("/dashboard");
  }

  return <UploadClient />;
};

export default Page;
