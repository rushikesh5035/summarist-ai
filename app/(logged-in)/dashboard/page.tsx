import React from "react";

import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { getSummaries } from "@/lib/summaries";
import { hasReachedUploadLimit } from "@/lib/user";

import DashboardClient from "./DashboardClient";

const Dashboard = async () => {
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(
    user?.id
  );
  const summaries = await getSummaries(user?.id);

  return (
    <DashboardClient
      summaries={summaries}
      hasReachedLimit={hasReachedLimit}
      uploadLimit={uploadLimit}
    />
  );
};

export default Dashboard;
