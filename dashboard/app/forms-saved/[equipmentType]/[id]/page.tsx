"use client";

import CustomLoader, { ReturnButton } from "@/components/CustomLoader";
import QuestionFormPDF from "@/components/QuestionFormPDF";
import QuestionFormWebPreview from "@/components/QuestionFormWebPreview";
import { useGetInspectionFormById } from "@/lib/network/forms";
import {
  Button,
  Divider,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { PDFViewer } from "@react-pdf/renderer";
import { IconAt } from "@tabler/icons-react";
import React, { Fragment } from "react";

const SavedForm: React.FC<{
  params: any;
  searchParams: any;
}> = ({ params, searchParams }) => {
  // Destructure the data object to access its properties
  const { data } = useGetInspectionFormById(params.id);
  const isPreview = searchParams?.mode === "preview";
  const icon = <IconAt size={16} />;

  if (!data || typeof data === "undefined") return <CustomLoader />;

  return (
    <>
      <Title size={30}>
        Final Inspection Report &mdash;{" "}
        <small className="text-blue-700">{decodeURI(params.id)}</small>
      </Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Preview of Final Inspection Report &mdash;{" "}
        <span className="font-bold">
          {decodeURI(params.equipmentType)} [Report ID: {params.id}]
        </span>
      </Text>
      <Divider className="mb-3" />
      <ReturnButton target={`/forms-saved/${params.equipmentType}`} />
      <Divider className="mb-8" />

      <div className="flex xs:flex-col gap-8">
        <div className="min-w-[40vw] max-w-[650px] mx-auto pb-10 pt-4x">
          {!isPreview && (
            <>
              <PDFViewer style={{ width: "100%", height: "70vh" }}>
                <QuestionFormPDF data={data} />
              </PDFViewer>
              <Divider />
            </>
          )}

          {isPreview && <QuestionFormWebPreview data={data} />}
        </div>
        <div className="flex-grow min-w-[300px] max-w-[30vw] mx-auto pb-10 pt-4x">
          <TextInput
            className="mb-2"
            leftSectionPointerEvents="none"
            leftSection={icon}
            type="email"
            variant="filled"
            aria-label="Recipient 1"
            placeholder="Recipient 1"
            required
          />
          <TextInput
            className="mb-2"
            leftSectionPointerEvents="none"
            leftSection={icon}
            type="email"
            variant="filled"
            aria-label="Recipient 2"
            placeholder="Recipient 2: (Optional)"
          />
          <TextInput
            className="mb-4"
            leftSectionPointerEvents="none"
            leftSection={icon}
            type="email"
            variant="filled"
            aria-label="Recipient 3"
            placeholder="Recipient 3: (Optional)"
          />
          <Textarea
            value={""}
            variant="filled"
            rows={7}
            maxLength={200}
            aria-label="Notes"
            placeholder="Enter any additional notes here..."
            readOnly
          />
          <Button className="mt-4 bg-blue-700" onClick={() => {}}>
            Share
          </Button>
        </div>
      </div>
    </>
  );
};

export default SavedForm;
