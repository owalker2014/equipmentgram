"use client";

import { signOut, useAuth } from "@/lib/authContext";
import { useGetUser } from "@/lib/network/users";
import { Avatar, Badge, Center, Divider, Skeleton, Text } from "@mantine/core";
import { IconBell, IconFileDownload, IconLicense, IconLogout, IconMailShare } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./SideNav.module.css";

const data = [
  { link: "/forms", label: "Forms", icon: IconLicense, hasAccessTo: "Inspector" },
  { link: "/forms-saved", label: "Saved", icon: IconFileDownload },
  { link: "/forms-sent", label: "Sent", icon: IconMailShare },
  { link: "/notifications", label: "Notifications", icon: IconBell },
  // { link: "/settings", label: "Settings", icon: IconSettings },
];

export function SideNav() {
  const navigation = useRouter();
  const [active, setActive] = useState("Billing");
  const { user } = useAuth();
  const { data: userData, isLoading } = useGetUser(user?.uid as string);

  if (isLoading)
    return (
      <>
        <Center>
          <Skeleton height={100} circle mb="xl" />
        </Center>
        <Skeleton height={10} radius="xl" />
        <Skeleton height={10} mt={6} radius="xl" />
        <Divider my={10} />
        <Skeleton height={30} mt={10} width="100%" />
        <Skeleton height={30} mt={10} width="100%" />
        <Skeleton height={30} mt={10} width="100%" />
        <Skeleton height={30} mt={10} width="100%" />
      </>
    );

  const links = data
    .filter((item) => (item.hasAccessTo ? item.hasAccessTo.toUpperCase() === userData?.type.toUpperCase() : true))
    .map((item) => (
      <Link
        className={classes.link}
        data-active={item.label === active || undefined}
        href={item.link}
        key={item.label}
        onClick={(event) => {
          // event.preventDefault();
          setActive(item.label);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    ));

  return (
    <div className="h-full flex flex-col justify-between ">
      <div className="divide-y flex flex-col gap-4">
        <div className="flex flex-col items-center ">
          <Badge color="blue" radius={0} className="absolute top-4 left-0">
            {userData?.type}
          </Badge>
          <Avatar size="xl" mb="md" src={user?.photoURL} />
          <Text>{user?.displayName}</Text>
          <Text>{user?.email}</Text>
        </div>
        <div className="pt-4">{links}</div>
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={() => {
            signOut();
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
