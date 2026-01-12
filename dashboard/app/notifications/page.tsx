"use client";

import CustomLoader from "@/components/CustomLoader";
import { useAuth } from "@/lib/authContext";
import { useGetNotification } from "@/lib/network/notification";
import { Divider, Notification, Text, Title } from "@mantine/core";
import React from "react";

type Props = {};

const Notifications = (props: Props) => {
  const { user } = useAuth();
  const { data, isLoading } = useGetNotification(user?.email!);

  return (
    <>
      <Title size={30}>Notifications</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Dispatched Notifications
      </Text>
      <Divider className="mb-8" />

      <div className="h-full max-w-[400px]x mx-auto">
        {data && data.length > 0 ? (
          data?.map((item, i) => {
            return (
              <Notification
                onClick={() => {
                  console.log("clicked");
                }}
                styles={{
                  root: {
                    boxShadow: "none",
                  },
                }}
                withBorder
                withCloseButton={false}
                title={item.message}
              ></Notification>
            );
          })
        ) : (
          <div className="h-full flexx items-centerx justify-centerx">
            {isLoading ? <CustomLoader /> : <>No Notifications</>}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
