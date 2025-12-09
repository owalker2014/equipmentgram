import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebaseConfig/init";

export const UsersCollection = "users";

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
};

export type UserWithId = User & {
  id: string;
};

export const useUsers = () => {
  return useQuery<UserWithId[], Error>([UsersCollection], async () => {
    const snapshot = await getDocs(collection(db, UsersCollection));
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as UserWithId)
    );
  });
};

export const useGetUser = (user_id: string | undefined) => {
  return useQuery<User, Error>(
    [UsersCollection, user_id],
    async () => {
      const docRef = doc(db, UsersCollection, user_id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as User;
      } else {
        console.log("No such document!");
        throw "no such document";
      }
    },
    {
      onError: (error) => {
        console.table(error);
      },
      enabled: !!user_id,
    }
  );
};

export const useSetUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (user: User) => {
      const docRef = doc(db, UsersCollection, user.user_id);
      return setDoc(docRef, user);

      // return addDoc(collection(db, UsersCollection, user.id), user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([UsersCollection]);
        queryClient.refetchQueries([UsersCollection]);
      },
      onError: (error) => {
        console.table(error);
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (user: UpdateUser) => {
      const docRef = doc(db, UsersCollection, user.user_id);
      return updateDoc(docRef, user);
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries([UsersCollection]);
        // queryClient.refetchQueries([UsersCollection]);
      },
      onError: (error) => {
        console.table(error);
      },
    }
  );
};

export const updateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ user_id, user }: { user_id: string; user: Partial<User> }) => {
      return updateDoc(doc(db, UsersCollection, user_id), {
        ...user,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([UsersCollection]);
        queryClient.refetchQueries([UsersCollection]);
      },
    }
  );
};

export const useSetUserType = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ user_id, type }: { user_id: string; type: UserType }) => {
      return updateDoc(doc(db, UsersCollection, user_id!), {
        type: type,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([UsersCollection]);
        queryClient.refetchQueries([UsersCollection]);
      },
    }
  );
};

export const useGetInspectors = () => {
  return useQuery<User[], Error>([UsersCollection, "inspectors"], async () => {
    const q = await query(
      collection(db, UsersCollection),
      where("type", "==", UserType.inspector)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as UserWithId)
    );
  });
};
