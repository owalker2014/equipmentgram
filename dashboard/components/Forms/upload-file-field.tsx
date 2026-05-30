// "use client";

import { storage } from "@/lib/firebaseConfig/init";
import { InspectionResult, runInspection } from "@/lib/network/forms";
import { FileInput } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

const MAX_FILE_SIZE_VALUE = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_VALUE * 1024 * 1024; // 2 MB

type Props = {
  onUploadComplete: (_url: string, _result: InspectionResult) => void;
  fileName: string;
  fieldLabel: string;
  error?: string;
  metadata: {
    equipment_type: string;
    manufacturer: string;
    model: string;
    section: string;
  };
  onProgress: (_progress: number) => void;
  onError: (_err: string) => void;
  clearFieldError: () => void;
};

const UploadFileField = ({
  onUploadComplete,
  fileName,
  fieldLabel: component,
  error,
  metadata,
  onProgress,
  onError,
  clearFieldError,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onChange = async (file: File) => {
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

    const urlPref = `${fileName}-${new Date().getTime()}-${uploadFile.name.replace(
      " ",
      "-",
    )}`;
    const storageRef = ref(storage, urlPref);
    const uploadTask = uploadBytesResumable(storageRef, uploadFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress =
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const progress = Math.max(
          1,
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 75),
        );
        // console.log("Upload is " + progress + "% done");
        onProgress(progress);

        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("error-uploading --> ", error.code); //eslint-disable-line
        onError("Upload failed. Please try again.");
        onProgress(0);
        setLoading(false);
      },
      () => {
        // Handle successful uploads on complete
        onProgress(90);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            return Promise.all([
              downloadURL,
              runInspection(uploadFile, { ...metadata, component }),
            ]);
          })
          .then(([downloadURL, [err, response]]) => {
            if (!err) {
              onUploadComplete(downloadURL, response as InspectionResult);
              onProgress(100);
              return;
            }
            onError(err as string);
            onProgress(0);
          })
          .catch((error) => {
            console.error("error-downloading --> ", error.code); //eslint-disable-line
            onError(`Hmmm...something isn't right!`);
            onProgress(0);
          })
          .finally(() => setLoading(false));
      },
    );
  };

  // for debugging
  // console.log('inspection-meta ---> ', { ...metadata, component });

  return (
    <>
      <FileInput
        accept="image/png,image/jpeg,image/heic,image/heif"
        capture="environment"
        disabled={loading}
        label={component}
        {...{ placeholder: component }}
        description={`capture an image for ${component}`}
        onChange={onChange}
        // onProgress={(e) => onProgress(e.eventPhase)}
        variant="filled"
        error={error}
        size="md"
        rightSection={<IconCamera color="grey" style={{ cursor: "pointer" }} />}
      />

      {/* {error && (
        <Text size="xs" mt={4} color="red">
          {error}
        </Text>
      )} */}
    </>
  );
};

export default UploadFileField;
