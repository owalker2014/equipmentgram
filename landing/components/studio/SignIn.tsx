"use client";

// The sign-in screen of the blog's studio, shown at /studio to
// anyone who is not signed in. It uses the accounts the site already has:
// the same email and password, or the same Google account.

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button, Divider, PasswordInput, TextInput } from "@mantine/core";
import { IconBrandGoogle, IconLock } from "@tabler/icons-react";
import { GoogleAuthProvider, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import firebaseApp from "@/lib/firebaseConfig/init";

// Firebase reports problems as codes. These are the sentences people see instead.
function plainError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
    case "auth/missing-password":
      return "That email and password do not match an account. Check both and try again.";
    case "auth/too-many-requests":
      return "Too many tries. Wait a few minutes, or reset your password below.";
    case "auth/network-request-failed":
      return "The sign-in service could not be reached. Check your internet connection and try again.";
    case "auth/user-disabled":
      return "This account has been switched off.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/popup-blocked":
      return "Your browser blocked the Google window. Allow pop-ups for this site and try again.";
    default:
      return "Signing in did not work. Try again in a moment.";
  }
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      // Nothing more to do here: the moment the sign-in succeeds, the
      // studio replaces this screen by itself.
    } catch (e) {
      setError(plainError(String((e as { code?: string })?.code || "")));
    } finally {
      setBusy(false);
    }
  }

  function withPassword(event: FormEvent) {
    event.preventDefault();
    run(() => signInWithEmailAndPassword(getAuth(firebaseApp), email.trim(), password));
  }

  function withGoogle() {
    run(() => signInWithPopup(getAuth(firebaseApp), new GoogleAuthProvider()));
  }

  async function resetPassword() {
    if (!email.trim()) {
      setNotice("");
      setError("Type your email address in the first box, then click the reset link again.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await sendPasswordResetEmail(getAuth(firebaseApp), email.trim());
    } catch {
      // Say the same thing either way, so nobody can test which addresses have accounts.
    } finally {
      setBusy(false);
      setNotice("If that address has an account, an email with a reset link is on its way.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-white">
            <IconLock size={22} />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">EquipmentGram</p>
          <h1 className="text-2xl font-bold text-slate-900">Blog studio</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in with your EquipmentGram account. Only admin accounts can manage the blog.</p>
        </div>

        <form onSubmit={withPassword} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <TextInput label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <PasswordInput label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
              {notice}
            </p>
          )}
          <Button type="submit" fullWidth loading={busy} className="bg-blue-700">
            Sign in
          </Button>
          <Divider label="or" labelPosition="center" />
          <Button type="button" fullWidth variant="default" disabled={busy} leftSection={<IconBrandGoogle size={16} />} onClick={withGoogle}>
            Continue with Google
          </Button>
          <button type="button" onClick={resetPassword} disabled={busy} className="block w-full text-center text-sm text-blue-700 hover:underline">
            Forgot your password?
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/" className="hover:underline">
            &larr; Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
