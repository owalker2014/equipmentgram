import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import { usersCollection } from "@/lib/network/users.shared";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const snapshot = await getDoc(doc(db, usersCollection, params.id));
  if (!snapshot.exists()) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ id: snapshot.id, ...snapshot.data() });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = await req.json();
  await updateDoc(doc(db, usersCollection, params.id), user);
  return NextResponse.json({ success: true });
}
