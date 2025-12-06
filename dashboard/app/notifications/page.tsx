"use client";

import CustomLoader from "@/components/CustomLoader";
import { useAuth } from "@/lib/authContext";
import { useGetNotification } from "@/lib/network/notification";
import { Notification } from "@mantine/core";
import React from "react";

type Props = {};

const Notifications = (props: Props) => {
  const { user } = useAuth();
  const { data, isLoading } = useGetNotification(user?.email!);

  if (isLoading) return <CustomLoader />;

  return (
    <div className="h-full max-w-[400px] mx-auto">
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
        <div className="h-full flex items-center justify-center">
          No Notifications
        </div>
      )}
    </div>
  );
};

export default Notifications;
