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
