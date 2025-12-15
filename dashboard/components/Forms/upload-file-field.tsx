import { storage } from "@/lib/firebaseConfig/init";
import { FileInput, Text } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

type Props = {
  onUploadComplete: (url: string) => void;
  fileName: string;
  fieldLabel: string;
  error?: string;
};

const UploadFileField = ({
  onUploadComplete,
  fileName,
  fieldLabel,
  error,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onChange = (file: File) => {
    const storageRef = ref(
      storage,
      fileName + new Date().getTime() + file.name
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setLoading(true);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
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
        setLoading(false);
        // Handle unsuccessful uploads
      },
      () => {
        setLoading(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadComplete(downloadURL);
        });
      }
    );
  };

  return (
    <>
      <FileInput
        accept="image/png,image/jpeg"
        capture="environment"
        disabled={loading}
        label={fieldLabel}
        placeholder={fieldLabel}
        description={`capture an image for ${fieldLabel}`}
        onChange={onChange}
        onProgress={() => {}}
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
