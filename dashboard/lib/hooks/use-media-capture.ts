import { storage } from "@/lib/firebaseConfig/init";
import { InspectionResult, runInspection } from "@/lib/network/forms";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

const MAX_FILE_SIZE_VALUE = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_VALUE * 1024 * 1024;

type MediaCaptureOptions = {
  fileName: string;
  component: string;
  metadata: {
    equipment_type: string;
    manufacturer: string;
    model: string;
    section: string;
  };
  onCaptured: (_url: string, file: File, _result: InspectionResult) => void;
  onProgress: (_progress: number) => void;
  onError: (_err: string) => void;
  clearFieldError: () => void;
};

export function useMediaCapture({
  fileName,
  component,
  metadata,
  onCaptured,
  onProgress,
  onError,
  clearFieldError,
}: MediaCaptureOptions) {
  const [loading, setLoading] = useState(false);

  const capture = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      onError(`File size must be ${MAX_FILE_SIZE_VALUE}MB or less`);
      return;
    }

    setLoading(true);
    clearFieldError();

    let uploadFile = file;
    if (file.type === "image/heic" || file.type === "image/heif") {
      try {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.85,
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        uploadFile = new File(
          [blob],
          file.name.replace(/\.hei[cf]$/i, ".jpg"),
          { type: "image/jpeg" },
        );
      } catch {
        onError("Failed to convert HEIC image. Please try again.");
        onProgress(0);
        setLoading(false);
        return;
      }
    }

    const urlPref = `${fileName}-${new Date().getTime()}-${uploadFile.name.replace(" ", "-")}`;
    const storageRef = ref(storage, urlPref);
    const uploadTask = uploadBytesResumable(storageRef, uploadFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.max(
          1,
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 75),
        );
        console.log("Upload is " + progress + "% done --- " + snapshot.state); //eslint-disable-line
        onProgress(progress);
      },
      (error) => {
        console.error("error-uploading --> ", error.code); //eslint-disable-line
        onError("Upload failed. Please try again.");
        onProgress(0);
        setLoading(false);
      },
      () => {
        onProgress(90);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            return Promise.all([
              downloadURL,
              // runInspection(uploadFile, { ...metadata, component }),
            ]);
          })
          .then(([downloadURL /* [err, response] */]) => {
            // if (!err) {
            // onCaptured(downloadURL, file, response as InspectionResult);
            onCaptured(downloadURL, file, {
              ...metadata,
              component,
            } as InspectionResult);
            onProgress(100);
            // return;
            // }
            // onError(err as string);
            // onProgress(0);
          })
          .catch((error) => {
            console.error("error-downloading --> ", error.code); //eslint-disable-line
            onError("Hmmm...something isn't right!");
            onProgress(0);
          })
          .finally(() => setLoading(false));
      },
    );
  };

  return { capture, loading };
}
