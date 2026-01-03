"use client";

import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig/init";
import { UserType, UsersCollection, useSetUser } from "@/lib/network/users";
import { doc, getDoc } from "@firebase/firestore";
import { Button, Divider, TextInput } from "@mantine/core";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutateAsync } = useSetUser();

  const auth = getAuth();
  const [emailLoginLoadingState, setEmailLoginLoadingState] = useState(false);

  function login() {
    setEmailLoginLoadingState(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        try {
          await updateUserAfterLogin(user);
          router.push("/");
        } catch (e) {
          console.error("[login][updateUserAfterLogin] error --> ", e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("error", errorCode, errorMessage);
        window.alert(errorMessage);
      })
      .finally(() => {
        setEmailLoginLoadingState(false);
      });
  }

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("sign with google", user);

        try {
          await updateUserAfterLogin(user);
          // router.push(process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/");
          router.push("/");
        } catch (e) {
          console.error(
            "[loginWithGoogle][updateUserAfterLogin] error --> ",
            e
          );
          throw e;
        }
      })
      .catch((error) => {
        console.error("[loginWithGoogle] error --> ", error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  async function updateUserAfterLogin(user: User) {
    const docRef = doc(db, UsersCollection, user.uid);
    const snapshot = await getDoc(docRef);

    const userType = snapshot.exists()
      ? snapshot?.data()?.type ?? UserType.customer
      : UserType.customer;

    mutateAsync({
      user_id: user.uid,
      email: user?.email!,
      display_name: user?.displayName!,
      photoURL: user?.photoURL!,
      phoneNumber: user?.phoneNumber!,
      type: userType,
      emailVerified: user?.emailVerified!,
    });

    if (!user.emailVerified) {
      await sendEmailVerification(auth.currentUser!).then(() => {
        console.log("email sent");
      });
    }
  }

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Signin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full px-4 md:w-1/2 m-auto my-10 md:my-20 lg:w-1/3 xl:w-1/4 lg:my-10 xl:my-20">
        <div className="text-center text-sm pb-4 font-extrabold text-blue-700">
          EquipmentGram
          <span className="block text-gray-700 mt-3 font-bold text-lg">
            Log in to your account
          </span>
        </div>
        <div className="space-y-5 p-8 rounded-lg shadow-lg">
          <TextInput
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            loading={emailLoginLoadingState}
            fullWidth
            onClick={() => login()}
          >
            Sign in
          </Button>

          <Divider label="Or Sign in with" />

          <div className="text-center text-gray-600">
            <Button
              className="bg-inherit border-none"
              title="Sign in with Google"
              onClick={() => loginWithGoogle()}
            >
              <img
                src="/logo-google.png"
                alt="google logo"
                className="inline h-5 mr-2"
              />
            </Button>
          </div>
          <Divider label="Don't have an account?" />
          <div className="text-sm text-gray-500 text-center">
            <Link href="/signup">
              <Button
                variant="outline"
                size="compact-sm"
                className="border-none"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
