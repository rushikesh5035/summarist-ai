import React from "react";

import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import UpgradeRequired from "@/components/common/UpgradeRequired";
import { ensureFreeUserExists, hasActivePlan } from "@/lib/user";

import Navbar from "./dashboard/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  // Ensure every new sign-up (free plan) gets a DB row on first login
  await ensureFreeUserExists(user);

  // const hasActiveSubscription = await hasActivePlan(
  //   user.emailAddresses[0].emailAddress
  // );

  // if (!hasActiveSubscription) {
  //   return <UpgradeRequired />;
  // }

  return (
    <>
      <div className="relative min-h-screen bg-[#111111] text-gray-300">
        <Navbar />
        {children}
      </div>
    </>
  );
}
