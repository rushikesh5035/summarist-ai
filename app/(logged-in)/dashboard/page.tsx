import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { getSummaries } from "@/lib/summaries";
import {
  ensureFreeUserExists,
  getDbUserId,
  hasReachedUploadLimit,
} from "@/lib/user";

import DashboardClient from "./DashboardClient";

const Dashboard = async () => {
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  // Create user in DB if this is their first login
  await ensureFreeUserExists(user);

  const dbUserId = await getDbUserId(user.id);
  if (!dbUserId) return redirect("/sign-in");

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
