"use client";

import { useAuth } from "@/lib/authContext";
import { useGetUser } from "@/lib/network/users";
import { Avatar, Badge, CheckIcon } from "@mantine/core";
import {
  IconCheck,
  IconHome,
  IconMail,
  IconSquareRoundedCheck,
  IconSquareRoundedCheckFilled,
} from "@tabler/icons-react";
import React from "react";

type Props = {};

const MyProfile = (props: Props) => {
  const { user } = useAuth();
  const { data: userData } = useGetUser(user?.claims.user_id as string);

  return (
    <div className="container mx-auto text-center max-w-2xl py-20 my-10 flex justify-center">
      <div className="border min-w-md bg-white rounded-lg overflow-hidden my-10">
        <Avatar
          className="mx-auto my-8 w-24 h-24"
          src={userData?.photoURL}
          radius="xl"
        />
        <Badge color="blue" variant="light" className="mx-6">
          {userData?.type}
        </Badge>
        <div className="py-4 px-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {userData?.display_name}
          </h1>
          <p className="py-2 text-lg text-gray-700">{userData?.jobTitle}</p>
          {/* <div className="flex items-center mt-4 text-gray-700">
            <IconHome size={18} />
            <h1 className="px-2 text-sm">{userData?.address?.city}</h1>
          </div> */}

          <div className="flex items-center mt-4 text-gray-700">
            <IconMail size={18} />
            <h1 className="px-2 text-sm">{userData?.email}</h1>
            {userData?.emailVerified && (
              <IconSquareRoundedCheckFilled
                className="text-green-600 text-sm"
                size={18}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
