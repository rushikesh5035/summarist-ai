import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

const HistoryPage = async () => {
  const user = await currentUser();
  if (!user?.id) redirect("/sign-in");

  return <div>History</div>;
};

export default HistoryPage;
