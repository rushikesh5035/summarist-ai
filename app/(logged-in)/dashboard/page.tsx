import { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { getSummaries } from "@/lib/summaries";
import {
  ensureFreeUserExists,
  getDbUserId,
  hasReachedUploadLimit,
} from "@/lib/user";

import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Upload and manage your PDF summaries",
  robots: {
    index: false,
    follow: false,
  },
};

const Dashboard = async () => {
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  // Get user from DB (webhook should have created it)
  let dbUserId = await getDbUserId(user.id);

  // Fallback: Create user if webhook missed it (for existing users or webhook failures)
  if (!dbUserId) {
    console.warn(
      "[Dashboard] User not found in DB, creating via fallback:",
      user.id
    );
    await ensureFreeUserExists(user);
    dbUserId = await getDbUserId(user.id);
    if (!dbUserId) return redirect("/sign-in");
  }

  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(
    user.id, // clerkId
    dbUserId // DB UUID
  );
  const summaries = await getSummaries(dbUserId);

  return (
    <>
      <DashboardClient
        summaries={summaries}
        hasReachedLimit={hasReachedLimit}
        uploadLimit={uploadLimit}
      />
    </>
  );
};

export default Dashboard;
