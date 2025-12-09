import { storage } from "@/lib/firebaseConfig/init";
import { Text } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

type Props = {
  onUploadComplete: (url: string) => void;
  fileName: string;
  error?: string;
};

const UploadFileField = ({ onUploadComplete, fileName, error }: Props) => {
  const [loading, setLoading] = useState(false);

  const onDropFile = (file: FileWithPath[]) => {
    const storageRef = ref(
      storage,
      fileName + new Date().getTime() + file[0].name
    );
    const uploadTask = uploadBytesResumable(storageRef, file[0]);

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
      <Dropzone
        w="200px"
        p={6}
        maxFiles={1}
        loading={loading}
        accept={IMAGE_MIME_TYPE}
        onDrop={onDropFile}
      >
        <Text ta="center">Upload Image</Text>
      </Dropzone>

      {error && (
        <Text size="xs" mt={4} color="red">
          {error}
        </Text>
      )}
    </>
  );
};

export default UploadFileField;
