import { InspectionFormWithId } from "@/lib/network/forms";
import { useAddNewSentReport } from "@/lib/network/sent-reports";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  sendTo: string;
};

interface Props extends InspectionFormWithId {
  sentFrom: string;
}

const ShareReportDialog = (inspectionForm: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { mutateAsync } = useAddNewSentReport();
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await fetch("/api/share-report", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          ...inspectionForm,
          sentFrom: inspectionForm.createdByUser?.display_name,
        }),
      });
      close();
      reset();
      notifications.show({
        title: "Report shared successfully",
        message: `Report shared with ${data.sendTo}`,
        color: "teal",
      });
      mutateAsync({
        sentTo: data.sendTo,
        ...inspectionForm,
        inspectionFormId: inspectionForm.id,
      });
    } catch (error) {
      notifications.show({
        title: "Report sharing failed",
        message: `Report failed to share with ${data.sendTo}`,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Share Report">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextInput
            {...register("sendTo")}
            label="Share report with"
            type="email"
          />
          <Button
            rightSection={<IconSend size={16} />}
            className="text-right bg-blue-700"
            type="submit"
            size="xs"
            loading={isLoading}
          >
            Share
          </Button>
        </form>
      </Modal>
      <Button onClick={open} className="bg-blue-700" size="xs">
        Share
      </Button>
    </>
  );
};

export default ShareReportDialog;
