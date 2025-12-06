"use client";

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
import { useRouter } from "next/navigation";
import { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutateAsync } = useSetUser();

  const auth = getAuth();
  const [emailLoginLoadingState, setEmailLoginLoadingState] = useState(false);

  function login() {
    setEmailLoginLoadingState(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        updateUserAfterLogin(user);

        router.push("/");
        setEmailLoginLoadingState(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
        setEmailLoginLoadingState(false);
      });
  }

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("sign with google", user);

        await updateUserAfterLogin(user);

        router.push("/");
      })
      .catch((error) => {
        console.log(error);
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

    if (snapshot.exists()) {
      console.log("user exists");
      mutateAsync({
        user_id: user.uid,
        email: user?.email!,
        display_name: user?.displayName!,
        photoURL: user?.photoURL!,
        phoneNumber: user?.phoneNumber!,
        type: snapshot.data()?.type!,
        emailVerified: user?.emailVerified!,
      });
    } else {
      mutateAsync({
        user_id: user.uid,
        email: user?.email!,
        display_name: user?.displayName!,
        photoURL: user?.photoURL!,
        phoneNumber: user?.phoneNumber!,
        type: UserType.customer,
        emailVerified: user?.emailVerified!,
      });
    }

    if (!user.emailVerified) {
      await sendEmailVerification(auth.currentUser!).then(() => {
        console.log("email sent");
      });
    }
  }

  return (
    <>
      <Head>
        <title>Signin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-xs mx-auto md:my-20 my-10">
        <div className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Passowrd"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            loading={emailLoginLoadingState}
            fullWidth
            onClick={() => login()}
          >
            Login
          </Button>

          <Divider />

          <Button fullWidth onClick={() => loginWithGoogle()}>
            Login with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
