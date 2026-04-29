"use client";

import { useAuth } from "@/lib/authContext";
import firebaseApp from "@/lib/firebaseConfig/init";
import { useGetUser } from "@/lib/network/users";
import { notify } from "@/lib/utils";
import { Avatar, TextInput, Title } from "@mantine/core";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { data: userData } = useGetUser(user?.uid as string);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(getAuth(firebaseApp), user.email);
      notify(
        {
          title: "Email sent",
          message: "Check your inbox to reset your password.",
        },
        false,
      );
    } catch (e) {
      notify({ title: "Error", message: (e as Error).message }, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title size={20}>Profile Settings</Title>
      <div className="flex flex-col rounded border border-slate-300 gap-6 p-4 mt-2 mb-7">
        <div className="flex md:flex-row gap-3">
          <Avatar size="xl" mb="md" src={userData?.photoURL} alt="user photo" />

          <div className="flex flex-col flex-grow mt-2">
            <h2 className="text-xl font-bold text-gray-800">
              {userData?.display_name}
            </h2>
            <p className="text-gray-600 text-sm">{userData?.email}</p>
          </div>
          <div>
            <button className="bg-blue-50 text-blue-700 py-1 px-3 border border-slate-200 rounded text-sm font-semibold mt-2">
              Change
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <small>Full Name</small>
            <TextInput
              value={userData?.display_name}
              placeholder="Full Name"
              classNames={{ input: "bg-gray-100 cursor-not-allowed" }}
              readOnly
              aria-readonly
            />
          </div>
          <label>
            <small>Email Address</small>
            <TextInput
              value={userData?.email}
              readOnly
              placeholder="Email Address"
              classNames={{ input: "bg-gray-100 cursor-not-allowed" }}
              aria-readonly
            />
          </label>
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Update Password"}
        </button>
      </div>
    </>
  );
};

export default ProfileSettings;
