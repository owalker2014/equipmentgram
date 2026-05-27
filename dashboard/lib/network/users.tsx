import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usersCollection = "users";

export enum UserType {
  admin = "admin",
  inspector = "inspector",
  customer = "customer",
}

export type User = {
  user_id: string;
  type: UserType;
  email?: string;
  display_name?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    city?: string;
    state?: string;
    zip?: string;
    line1?: string;
    line2?: string;
  };
  nameOfBusiness?: string;
  jobTitle?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  photoURL?: string;
  signatureUrl?: string;
  stripe_customer_id?: string;
};

export type UpdateUser = {
  user_id: string;
  type?: UserType;
  email?: string;
  display_name?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    city?: string;
    state?: string;
    zip?: string;
    line1?: string;
    line2?: string;
  };
  nameOfBusiness?: string;
  jobTitle?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  photoURL?: string;
  signatureUrl?: string;
  stripe_customer_id?: string;
};

export type UserWithId = User & {
  id: string;
};

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
    {
      enabled: !!user_id,
      staleTime: Infinity,
    },
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
