"use client";

import CustomLoader from "@/components/Loader";
import { USStates } from "@/components/forms/formUtils";
import { useAuth } from "@/lib/authContext";
import { UserType, useSetUser } from "@/lib/network/users";
import { Button, Select, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const schema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email().required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Home: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { mutate, mutateAsync, isLoading: isLoadingSetUser } = useSetUser();
  const { getInputProps, onSubmit, values } = useForm({
    validate: yupResolver(schema),
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      nameOfBusiness: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      jobTitle: "",
    },
  });

  const auth = getAuth();

  // if (loading) return <CustomLoader />;

  // if (user) {
  //   router.push("/");
  //   return null;
  // }

  const [isCreatingUser, setIsCreatingUser] = useState(false);

  async function createUserCredentials() {
    setIsCreatingUser(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("success", user);
        await mutateAsync({
          user_id: user.uid,
          email: user?.email!,
          display_name: values.firstName + " " + values.lastName,
          firstName: values.firstName,
          lastName: values.lastName,
          address: {
            city: values.city,
            state: values.state,
            zip: values.zipCode,
            line1: values.addressLine1,
            line2: values.addressLine2,
          },
          nameOfBusiness: values.nameOfBusiness,
          jobTitle: values.jobTitle,
          photoURL: user?.photoURL!,
          phoneNumber: user?.phoneNumber!,
          emailVerified: user?.emailVerified!,
          type: UserType.customer,
        });

        if (!user.emailVerified) {
          sendEmailVerification(auth.currentUser!).then(() => {
            console.log("email sent");
          });
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setIsCreatingUser(false);
      });
  }

  if (loading) return <CustomLoader />;

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Signup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full px-4 md:w-1/2 m-auto my-10 md:my-10 pb-4">
        <h1 className="mb-8 font-bold text-center text-2xl">
          Individual Registration
        </h1>
        <form onSubmit={onSubmit(createUserCredentials)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              placeholder="First Name"
              {...getInputProps("firstName")}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              {...getInputProps("lastName")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Email"
              type="email"
              placeholder="Email"
              {...getInputProps("email")}
            />
            <TextInput
              label="Phone"
              placeholder="Phone"
              {...getInputProps("phone")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Username"
              placeholder="To be used when logging into account"
              {...getInputProps("username")}
            />
            <TextInput
              type="password"
              label="Password"
              placeholder="To be used when logging into account"
              {...getInputProps("password")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Name Of Business"
              {...getInputProps("nameOfBusiness")}
            />
            <TextInput label="Job/Job Title" {...getInputProps("jobTitle")} />
          </div>

          <div className="grid gap-4">
            <TextInput
              label="Address"
              placeholder="Address Line 1"
              {...getInputProps("addressLine1")}
            />
            <TextInput
              placeholder="Address Line 2"
              {...getInputProps("addressLine2")}
            />
          </div>

          <div className="grid grid-cols-8 gap-4">
            <TextInput
              placeholder="City"
              className="col-span-3"
              {...getInputProps("city")}
            />
            <Select
              placeholder="State"
              data={Object.entries(USStates).map(([statekey, state]) => ({
                value: state,
                label: state,
              }))}
              className="col-span-3"
              {...getInputProps("state")}
            />

            <TextInput
              placeholder="Zip Code"
              className="col-span-2"
              {...getInputProps("zipCode")}
            />
          </div>

          <Button loading={isCreatingUser || isLoadingSetUser} type="submit">
            Submit
          </Button>
        </form>
        {/* <div>
          <button onClick={() => loginWithGoogle()}>Login with Google</button>
        </div> */}
      </div>
    </>
  );
};

export default Home;
