// Import the functions you need from the SDKs you need
import admin from "firebase-admin";
import { getStorage, getDownloadURL } from "firebase-admin/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const serviceAccount = {
  type: process.env.NEXT_PUBLIC_type,
  project_id: process.env.NEXT_PUBLIC_project_id,
  private_key_id: process.env.NEXT_PUBLIC_private_key_id,
  private_key: process.env.NEXT_PUBLIC_private_key?.replace(/\\n/g, "\n"),
  client_email: process.env.NEXT_PUBLIC_client_email,
  client_id: process.env.NEXT_PUBLIC_client_id,
  auth_uri: process.env.NEXT_PUBLIC_auth_uri,
  token_uri: process.env.NEXT_PUBLIC_token_uri,
  auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.NEXT_PUBLIC_client_x509_cert_url,
} as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
export { getStorage, getDownloadURL }
