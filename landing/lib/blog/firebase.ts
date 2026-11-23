// The blog's connection to the database (Firestore).
//
// It uses the "lite" flavour of the Firestore library. Lite makes one plain web
// request per question and then stops, which is what a web page that is built
// on the server needs. The rest of the site keeps using its own connection in
// lib/firebaseConfig/init.ts. Both share the same Firebase project and the
// same signed-in user.

import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};

export const blogApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const blogDb = getFirestore(blogApp);
