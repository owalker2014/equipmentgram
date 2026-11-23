"use client";

// The blog's own studio, at /studio. It is separate from the site's
// /admin area: its own sign-in screen, its own menu, its own look.
//
// This file decides what a visitor to any /studio address sees:
//   not signed in          -> the sign-in screen
//   signed in, not an admin -> a short "no access" message
//   signed in as an admin   -> the menu on the left and the screen they asked for
//
// It only decides what is drawn. What an account may read or change is
// enforced by the database rules, whatever this file does.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button, Loader } from "@mantine/core";
import { IconArticle, IconCategory, IconExternalLink, IconHome, IconLogout, IconMenu2, IconPlugConnected, IconPlus, IconTableImport, IconX } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore/lite";
import { signOut, useAuth } from "@/lib/authContext";
import { blogDb } from "@/lib/blog/firebase";
import firebaseApp from "@/lib/firebaseConfig/init";
import SignIn from "./SignIn";

const MENU = [
  { href: "/studio", label: "Home", icon: IconHome },
  { href: "/studio/posts", label: "Posts", icon: IconArticle },
  { href: "/studio/categories", label: "Categories", icon: IconCategory },
  { href: "/studio/bulk", label: "Bulk pages", icon: IconTableImport },
  { href: "/studio/status", label: "Status check", icon: IconPlugConnected },
];

type Access = "checking" | "admin" | "denied" | "error";

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">{children}</div>;
}

export default function StudioShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const uid = user?.claims?.user_id;
  const email = user?.claims?.email || "";
  const path = usePathname() || "";
  const [access, setAccess] = useState<Access>("checking");
  const [menuOpen, setMenuOpen] = useState(false);

  // Is this account an admin? The answer is the "type" field of its record in "users".
  useEffect(() => {
    let current = true;
    if (!uid) {
      setAccess("checking");
      return;
    }
    setAccess("checking");
    getDoc(doc(blogDb, "users", uid))
      .then((snap) => {
        if (current) setAccess(snap.exists() && snap.data()?.type === "admin" ? "admin" : "denied");
      })
      .catch(() => {
        if (current) setAccess("error");
      });
    return () => {
      current = false;
    };
  }, [uid]);

  // Close the phone menu after moving to another screen.
  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  // Right after a sign-in, the site knows the account a moment before it has
  // read its details. Wait for them instead of flashing the sign-in screen.
  const signingIn = !user && !!getAuth(firebaseApp).currentUser;

  if (loading || signingIn) {
    return (
      <Centered>
        <Loader aria-label="Loading" />
      </Centered>
    );
  }

  if (!user) return <SignIn />;

  if (access === "checking") {
    return (
      <Centered>
        <Loader aria-label="Checking your account" />
      </Centered>
    );
  }

  if (access !== "admin") {
    return (
      <Centered>
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">{access === "denied" ? "This account cannot manage the blog" : "Your account could not be checked"}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {access === "denied"
              ? `You are signed in as ${email || "an account"}, which does not have the admin role. Sign in with an admin account, or ask an admin to change this account's role under Admin, then Users.`
              : "The database did not answer. Check your connection and reload the page."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button variant="default" onClick={() => signOut()}>
              Sign out
            </Button>
            <Button component={Link} href="/" variant="subtle">
              Back to the website
            </Button>
          </div>
        </div>
      </Centered>
    );
  }

  // The menu entry to light up. A post being written counts as "Posts".
  const current = [...MENU].reverse().find((item) => path === item.href || path.startsWith(item.href + "/")) || MENU[0];
  const showTitle = path === current.href && current.href !== "/studio";

  const menu = (
    <nav aria-label="Blog studio" className="flex flex-col gap-1">
      {MENU.map((item) => {
        const Icon = item.icon;
        const active = item === current;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
              active ? "bg-blue-700 text-white" : "text-slate-200 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="bg-slate-900 text-white md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/studio" className="leading-tight">
            <span className="block text-xs font-semibold uppercase tracking-wide text-blue-300">EquipmentGram</span>
            <span className="block text-lg font-bold">Blog studio</span>
          </Link>
          <button type="button" className="rounded-md p-2 text-slate-200 hover:bg-slate-800 md:hidden" aria-label={menuOpen ? "Close the menu" : "Open the menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>

        <div className={`${menuOpen ? "block" : "hidden"} px-3 pb-4 md:flex md:flex-1 md:flex-col`}>
          <Link href="/studio/posts/new" className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">
            <IconPlus size={16} />
            New post
          </Link>
          {menu}
          <div className="mt-6 border-t border-slate-700 pt-4 md:mt-auto">
            <a href="/blog" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white">
              <IconExternalLink size={18} />
              View the blog
            </a>
            <p className="mt-3 truncate px-3 text-xs text-slate-400" title={email}>
              Signed in as {email}
            </p>
            <button type="button" onClick={() => signOut()} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white">
              <IconLogout size={18} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 md:ml-60">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          {showTitle && <h1 className="mb-6 text-2xl font-bold text-slate-900">{current.label}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}
