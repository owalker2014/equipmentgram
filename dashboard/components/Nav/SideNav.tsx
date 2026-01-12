"use client";

import { signOut, useAuth } from "@/lib/authContext";
import { useGetUser } from "@/lib/network/users";
import { Avatar, Badge, Text } from "@mantine/core";
import {
  IconBell,
  IconFileDownload,
  IconHome,
  IconLicense,
  IconLogout,
  IconMailShare,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import classes from "./SideNav.module.css";

const data = [
  { link: "/", label: "Home", icon: IconHome },
  {
    link: "/forms",
    label: "Forms",
    icon: IconLicense,
    hasAccessTo: "Inspector",
  },
  { link: "/forms-saved", label: "Saved", icon: IconFileDownload },
  { link: "/forms-sent", label: "Sent", icon: IconMailShare },
  { link: "/notifications", label: "Notifications", icon: IconBell },
  // { link: "/settings", label: "Settings", icon: IconSettings },
];

export function SideNav() {
  const navigation = useRouter();
  const pathname = usePathname(); // Reads the current URL pathname

  const { user } = useAuth();
  const { data: userData } = useGetUser(user?.uid as string);

  // if (isLoading)
  //   return (
  //     <>
  //       <Center>
  //         <Skeleton height={100} circle mb="xl" />
  //       </Center>
  //       <Skeleton height={10} radius="xl" />
  //       <Skeleton height={10} mt={6} radius="xl" />
  //       <Divider my={10} />
  //       <Skeleton height={30} mt={10} width="100%" />
  //       <Skeleton height={30} mt={10} width="100%" />
  //       <Skeleton height={30} mt={10} width="100%" />
  //       <Skeleton height={30} mt={10} width="100%" />
  //     </>
  //   );

  const links = data
    .filter((item) =>
      item.hasAccessTo
        ? item.hasAccessTo.toUpperCase() === userData?.type.toUpperCase()
        : true
    )
    .map((item) => (
      <Link
        className={classes.link}
        data-active={item.link === pathname || undefined}
        href={item.link}
        key={item.label}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    ));

  // don't show anything if not logged in
  if (!userData?.email) return <></>;

  return (
    <div className="h-full flex flex-col justify-between ">
      <div className="divide-y flex flex-col gap-4">
        <div className="flex flex-col items-center ">
          <Badge
            color="blue"
            radius={0}
            className="absolute top-4 left-0 bg-blue-700"
          >
            {userData?.type}
          </Badge>
          <Avatar size="xl" mb="md" src={userData?.photoURL} />
          <Text className="font-bold">{userData?.display_name}</Text>
          <Text>{userData?.email}</Text>
        </div>
        {userData?.email && <div className="pt-4">{links}</div>}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={async () => {
            await signOut();
            navigation.push(process.env.NEXT_PUBLIC_REDIRECT_URL as string);
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
}
