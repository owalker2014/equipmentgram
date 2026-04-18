"use client";

import { useAuth } from "@/lib/authContext";
import { storage } from "@/lib/firebaseConfig/init";
import { useGetUser, useUpdateUser } from "@/lib/network/users";
import { notify } from "@/lib/utils";
import { Button, FileInput, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCamera } from "@tabler/icons-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";

export const DigitalSignature: React.FC = () => {
  const { user } = useAuth();
  const { data: userData } = useGetUser(user?.uid as string);
  const { mutateAsync: updateUser } = useUpdateUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !user?.uid) return;
    setLoading(true);

    const storageRef = ref(storage, `signatures/${user.uid}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        notify({ title: "Upload failed", message: error.message }, true);
        setLoading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await updateUser({ user_id: user.uid, signatureUrl: url });
          notify(
            {
              title: "Signature updated",
              message: "Your digital signature has been saved.",
            },
            false,
          );
          setFile(null);
          close();
        } catch (e: any) {
          notify({ title: "Error", message: e.message }, true);
        } finally {
          setLoading(false);
        }
      },
    );
  };

  return (
    <>
      <Title size={20}>Digital Signature</Title>
      <div className="flex flex-row rounded border border-slate-300 gap-6 p-4 mt-2">
        <div className="flex-grow">
          <div className="flex gap-2">
            {userData?.signatureUrl && (
              <img
                src={userData.signatureUrl}
                alt={"digital signature"}
                className={
                  // "max-h-20 object-contain"
                  "rounded-lg h-full object-cover"
                }
              />
            )}
            {!userData?.signatureUrl && (
              <p className="text-sm text-gray-400">No signature uploaded</p>
            )}
          </div>
        </div>

        <button
          onClick={open}
          className="px-8 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
        >
          {userData?.signatureUrl ? <>Update</> : <>Create</>}
        </button>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title={<strong>Upload Digital Signature</strong>}
        centered
      >
        <div className="space-y-4">
          <FileInput
            label="Select signature image"
            description="Upload a PNG or JPG of your signature"
            accept="image/png,image/jpeg"
            leftSection={<IconCamera size={16} />}
            value={file}
            onChange={setFile}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              loading={loading}
              disabled={!file}
              className="bg-blue-700"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DigitalSignature;
