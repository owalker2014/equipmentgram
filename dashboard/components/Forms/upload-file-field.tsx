import { storage } from "@/lib/firebaseConfig/init";
import { InspectionResult, runInspection } from "@/lib/network/forms";
import { FileInput, Text } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

type Props = {
  onUploadComplete: (url: string, result: InspectionResult) => void;
  fileName: string;
  fieldLabel: string;
  error?: string;
  metadata: {
    equipment_type: string;
    manufacturer: string;
    model: string;
    section: string;
  };
  onProgress: (progress: number) => void;
  onError: (err: string) => void;
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

  const onChange = (file: File) => {
    setLoading(true);
    clearFieldError();

    const urlPref = `${fileName}-${new Date().getTime()}-${file.name.replace(
      " ",
      "-"
    )}`;
    const storageRef = ref(storage, urlPref);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // onProgress(progress);

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        setLoading(false);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            return Promise.all([
              downloadURL,
              runInspection(file, { ...metadata, component }),
            ]);
          })
          .then(([downloadURL, [error, response]]) => {
            if (!error) {
              onUploadComplete(downloadURL, response as InspectionResult);
              return;
            }
            onError(error as string); //
          })
          .finally(() => setLoading(false));
      }
    );
  };

  // for debugging
  // console.log('inspection-meta ---> ', { ...metadata, component });

  return (
    <>
      <FileInput
        accept="image/png,image/jpeg"
        capture="environment"
        disabled={loading}
        label={component}
        {...{ placeholder: component }}
        description={`capture an image for ${component}`}
        onChange={onChange}
        onProgress={(e) => onProgress(e.eventPhase)}
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
