"use client";

import { useAuth } from "@/lib/authContext";
import { useGetUser, UserType } from "@/lib/network/users";
import { Button, Divider, List, Skeleton, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetSentReports } from "@/lib/network/sent-reports";
import { useGetInspectionFormByType } from "@/lib/network/forms";
import { useGetNotification } from "@/lib/network/notification";

const links = [
  {
    label: "Start New Inspection",
    path: "/forms",
  },
  {
    label: "View Saved Reports",
    path: "/forms-saved",
  },
  {
    label: "View Sent Reports",
    path: "/forms-sent",
  },
];

export default function Home(props: any) {
  const { user } = useAuth();
  const { data: userData } = useGetUser(user?.uid as string);

  const { data: savedReportsData } = useGetInspectionFormByType(
    user?.uid!,
    undefined,
    userData?.type === UserType.customer
  );

  const { data: sentReportsData } = useGetSentReports();
  const { data: notificationData, isLoading } = useGetNotification(
    user?.email!
  );

  useEffect(() => {}, []);

  const navigation = useRouter();

  if (!userData?.email) {
    return (
      <>
        <Skeleton height={10} radius="lg" width="600px" />
        <Skeleton height={10} mt={6} radius="lg" width="600px" />
        <Skeleton height={30} mt={10} width="600px" />
        <Skeleton height={30} mt={10} width="600px" />
        <Skeleton height={30} mt={10} width="600px" />
        <Skeleton height={30} mt={10} width="600px" />
      </>
    );
  }

  return (
    <main>
      <Title size={30}>Home</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of your inspections
      </Text>
      <Divider className="mb-8" />

      {links.map((link, i) => (
        <Button
          key={`link-${i}`}
          size="xl"
          className="flex max-w-full min-w-[600px] text-lg my-4 bg-blue-700"
          onClick={() => navigation.push(link.path)}
        >
          {link.label}
        </Button>
      ))}

      <Text className="font-bold mt-10">
        Saved Reports: {savedReportsData?.length ?? 0}
      </Text>
      <Text className="font-bold">
        Sent Reports: {sentReportsData?.length ?? 0}
      </Text>

      <h4 className="font-bold mt-7">Recent Notifications</h4>
      {notificationData?.map((note, i) => (
        <List listStyleType="square">
          <List.Item key={`note-${i}`}>{note.message}</List.Item>
        </List>
      ))}
      {notificationData?.length === 0 && <>----</>}
    </main>
  );
}
