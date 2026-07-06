import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  Notification,
  notificationsCollection,
} from "@/lib/network/notification.shared";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const q = query(
    collection(db, notificationsCollection),
    where("to", "==", email),
  );
  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Notification),
  }));
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const notification = await req.json();
  const docRef = await addDoc(
    collection(db, notificationsCollection),
    notification,
  );
  return NextResponse.json({ id: docRef.id });
}
