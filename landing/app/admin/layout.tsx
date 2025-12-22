"use client";

import CustomLoader from "@/components/Loader";
import { useAuth } from "@/lib/authContext";
import { UserType, useGetUser } from "@/lib/network/users";
import { SegmentedControl } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

export enum Tab {
  InspectionRequests = "Inspection Requests",
  InspectionReports = "Inspection Reports",
  Users = "Users",
  Tools = "Admin Tools",
}

export function mapTabToPath(tab: Tab): string {
  switch (tab) {
    case Tab.InspectionRequests:
      return "/admin/inspection-requests";
    case Tab.InspectionReports:
      return "/admin/inspection-reports";
    case Tab.Users:
      return "/admin/users";
    case Tab.Tools:
      return "/admin/tools";
  }
}

export type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [value, setValue] = useState(path?.split("/")[2]);

  const { user } = useAuth();
  const { data: userData, isLoading } = useGetUser(user?.claims.user_id as string);

  if (isLoading) return <CustomLoader />;

  if (userData?.type !== UserType.admin) {
    router.push("/access-denied");
    return null;
  }

  return (
    <div className="container mx-auto max-w-screen-xl my-20">
      <SegmentedControl
        value={value}
        onChange={(v) => {
          router.push(`/admin/${v}`);
          setValue(v);
        }}
        data={[
          { label: "Inspection Requests", value: "inspection-requests" },
          { label: "Inspection Reports", value: "inspection-reports" },
          { label: "Users", value: "users" },
          { label: "Admin Tools", value: "tools" },
        ]}
      />
      <div className="my-10">{children}</div>
    </div>
  );
}
