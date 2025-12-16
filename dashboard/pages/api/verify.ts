import admin from "@/lib/firebaseConfig/init-admin";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  token?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) {
      res.status(401).json({ error: "No ID token provided." });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const customToken = await admin.auth().createCustomToken(decodedToken.uid);

    res.status(200).json({ token: customToken });
  } catch (error) {
    res.status(500).json({ error: "Error verifying ID token." });
  }
}
