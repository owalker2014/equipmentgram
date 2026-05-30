import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import { usersCollection, UserWithId } from "@/lib/network/users";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const type = req.nextUrl.searchParams.get("type");

  const ref = collection(db, usersCollection);
  const q = type ? query(ref, where("type", "==", type)) : query(ref);
  const snapshot = await getDocs(q);

  const users = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as UserWithId,
  );
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = await req.json();
  await setDoc(doc(db, usersCollection, user.user_id), user);
  return NextResponse.json({ success: true });
}
