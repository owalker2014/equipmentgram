// Sends a picture to Firebase Storage and returns its web address.
// Runs in the browser only.

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { blogApp } from "./firebase";
import { slugify } from "./text";

export type UploadedImage = { url: string; width: number; height: number };

// Photos straight from a phone are far bigger than a web page needs.
const MAX_WIDTH = 1600;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Prepared = { blob: Blob; width: number; height: number; type: string };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as a picture."));
    };
    img.src = url;
  });
}

// Shrinks a picture that is wider than MAX_WIDTH. Smaller pictures are sent as they are.
async function prepare(file: File): Promise<Prepared> {
  const img = await loadImage(file);
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (file.type === "image/gif" || width <= MAX_WIDTH) return { blob: file, width, height, type: file.type };

  const scale = MAX_WIDTH / width;
  const canvas = document.createElement("canvas");
  canvas.width = MAX_WIDTH;
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  if (!context) return { blob: file, width, height, type: file.type };
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  if (!blob) return { blob: file, width, height, type: file.type };
  return { blob, width: canvas.width, height: canvas.height, type };
}

// folder is the post's address, so each post's pictures sit together in Storage.
export async function uploadBlogImage(file: File, folder: string): Promise<UploadedImage> {
  if (!ALLOWED.includes(file.type)) throw new Error("Please choose a JPG, PNG, WebP or GIF picture.");
  if (file.size > MAX_FILE_BYTES) throw new Error("That picture is larger than 15 MB. Please choose a smaller one.");

  const prepared = await prepare(file);
  const extension = prepared.type === "image/png" ? "png" : prepared.type === "image/webp" ? "webp" : prepared.type === "image/gif" ? "gif" : "jpg";
  const baseName = slugify(file.name.replace(/\.[a-z0-9]+$/i, "")) || "picture";
  const path = `blog/${folder || "unsorted"}/${Date.now()}-${baseName}.${extension}`;

  const target = ref(getStorage(blogApp), path);
  await uploadBytes(target, prepared.blob, {
    contentType: prepared.type,
    // The file name is unique, so browsers may keep the picture for a year.
    cacheControl: "public, max-age=31536000, immutable",
  });
  return { url: await getDownloadURL(target), width: prepared.width, height: prepared.height };
}

// Used by the status check: uploads a one-pixel picture and removes it again.
export async function testImageUpload(): Promise<void> {
  const pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const bytes = Uint8Array.from(atob(pixel), (c) => c.charCodeAt(0));
  const target = ref(getStorage(blogApp), `blog/zz-status-check/${Date.now()}.png`);
  await uploadBytes(target, new Blob([bytes], { type: "image/png" }), { contentType: "image/png" });
  await deleteObject(target);
}
