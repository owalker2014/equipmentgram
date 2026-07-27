import BillingInformation from "@/components/settings/BillingInformation";
import DigitalSignature from "@/components/settings/DigitalSignature";
import ProfileSettings from "@/components/settings/ProfileSettings";
import { Divider, Text, Title } from "@mantine/core";
import React from "react";

type Props = Record<string, never>;

const SettingsPage = (props: Props) => {
  return (
    <>
      <Title size={30}>Settings</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Manage your account settings
      </Text>

      <Divider className="mb-8" />
      <div className="lg:w-[40%] h-full">
        <ProfileSettings />
        <BillingInformation />
        <DigitalSignature />
      </div>
    </>
  );
};

export default SettingsPage;
