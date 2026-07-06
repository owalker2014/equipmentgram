"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export * from "./users.shared";
import type { User, UpdateUser, UserWithId } from "./users.shared";
import { usersCollection, UserType } from "./users.shared";

export const useUsers = () => {
  return useQuery<UserWithId[], Error>([usersCollection], async () => {
    const res = await fetch("/api/users");
    return res.json();
  });
};

export const useGetUser = (user_id: string | undefined) => {
  return useQuery<User, Error>(
    [usersCollection, user_id],
    async () => {
      const res = await fetch(`/api/users/${user_id}`);
      return res.json();
    },
    { enabled: !!user_id, staleTime: Infinity },
  );
};

export const useSetUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (user: User) => {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([usersCollection]);
        queryClient.refetchQueries([usersCollection]);
      },
    },
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (user: UpdateUser) => {
      await fetch(`/api/users/${user.user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([usersCollection]);
        queryClient.refetchQueries([usersCollection]);
      },
    },
  );
};

export const useSetUserType = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ user_id, type }: { user_id: string; type: UserType }) => {
      await fetch(`/api/users/${user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([usersCollection]);
        queryClient.refetchQueries([usersCollection]);
      },
    },
  );
};

export const useGetInspectors = () => {
  return useQuery<User[], Error>([usersCollection, "inspectors"], async () => {
    const res = await fetch("/api/users?type=inspector");
    return res.json();
  });
};
