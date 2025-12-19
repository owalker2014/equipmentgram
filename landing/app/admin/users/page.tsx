"use client";

import CustomLoader from "@/components/Loader";
import { UserItem } from "@/components/admin/UserItem";
import { useAuth } from "@/lib/authContext";
import { UserType, useUsers } from "@/lib/network/users";
import { Checkbox } from "@mantine/core";
import { NextPage } from "next";
import { useState } from "react";

const Inspectors: NextPage = () => {
  const [types, setTypes] = useState<UserType[]>([
    UserType.admin,
    UserType.inspector,
    UserType.customer,
  ]);
  const [userIds] = useState<string[]>([]);
  const { user, loading } = useAuth();
  const { data: users, isLoading } = useUsers();

  const selectedUsers = users?.filter((u) => userIds.includes(u.user_id));

  if (loading || isLoading) return <CustomLoader />;
  if (!user) return <h1>You are not logged in. Please login to continue.</h1>;

  return (
    <div className="-mx-4 flex flex-wrap">
      <div className="w-full px-4 lg:w-4/12">
        <div className="mb-8 border bg-white">
          <div className="border-b  p-4">
            <h3 className="text-base font-semibold text-body-color sm:text-lg lg:text-base xl:text-lg">
              Filter by Type
            </h3>
          </div>
          <div className="space-y-4 p-4">
            <Checkbox.Group
              defaultValue={types}
              withAsterisk
              onChange={(values) => {
                setTypes(values as UserType[]);
              }}
            >
              <div className="space-y-4">
                <Checkbox value={UserType.admin} label="Admin" />
                <Checkbox value={UserType.inspector} label="Inspector" />
                <Checkbox value={UserType.customer} label="Customer" />
              </div>
            </Checkbox.Group>
          </div>
        </div>
      </div>
      <div className="w-full px-4 lg:w-8/12">
        <div className="h-full items-center justify-center  border">
          <div className="overflow-hidden bg-white  ">
            <ul role="list" className="divide-y divide-gray-200 flex flex-col">
              {selectedUsers?.map((user) => (
                <UserItem user={user} emphasize={true} key={user.id} />
              ))}
              {users
                ?.filter((u) => types.includes(u.type))
                .map((user) => (
                  <UserItem user={user} key={user.id} />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspectors;
