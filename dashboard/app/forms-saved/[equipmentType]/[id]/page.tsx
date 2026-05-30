"use client";

import CustomLoader, { ReturnButton } from "@/components/CustomLoader";
import QuestionFormPDF from "@/components/QuestionFormPDF";
import QuestionFormWebPreview from "@/components/QuestionFormWebPreview";
import { useAuth } from "@/lib/authContext";
import { useGetInspectionFormById } from "@/lib/network/forms";
import { notify } from "@/lib/utils";
import {
  ActionIcon,
  Button,
  Divider,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { IconAt, IconDownload } from "@tabler/icons-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef, useState } from "react";

const SavedForm: React.FC<{
  params: any;
  searchParams: any;
}> = ({ params, searchParams }) => {
  const { data } = useGetInspectionFormById(params.id);
  const { user } = useAuth();
  const isPreview = searchParams?.mode === "preview";
  const icon = <IconAt size={16} />;

  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [isSharing, setIsSharing] = useState(false);
  const [recipient1, setRecipient1] = useState("");
  const [recipient2, setRecipient2] = useState("");
  const [recipient3, setRecipient3] = useState("");
  const [notes, setNotes] = useState("");

  const handleShare = async () => {
    if (!data || !recipient1) return;
    setIsSharing(true);
    try {
      const blob = await pdf(<QuestionFormPDF data={data} />).toBlob();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const sendTo = [recipient1, recipient2, recipient3].filter(Boolean);
      const sentFrom = user?.displayName || user?.email || "EquipmentGram";

      const res = await fetch("/api/share-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sendTo, sentFrom, pdfBase64, notes }),
      });

      if (res.ok) {
        notify(
          {
            title: "Report Shared",
            message: "Inspection report sent successfully.",
          },
          false,
        );
      } else {
        notify(
          {
            title: "Share Failed",
            message: "Could not send the report. Please try again.",
          },
          true,
        );
      }
    } catch {
      notify(
        { title: "Share Failed", message: "An unexpected error occurred." },
        true,
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 0,
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let yOffset = 0;
      let remainingHeight = imgHeight;
      while (remainingHeight > 0) {
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin - yOffset,
          imgWidth,
          imgHeight,
        );
        remainingHeight -= contentHeight;
        yOffset += contentHeight;
        if (remainingHeight > 0) pdf.addPage();
      }
      pdf.save(`inspection-report-${params.id}.pdf`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
      <Divider className="mb-5" />

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1440px]">
        <div className="w-full lg:shrink-0 lg:w-3/5 pb-10">
          {!isPreview && (
            <>
              <PDFViewer style={{ width: "100%", height: "70vh" }}>
                <QuestionFormPDF data={data} />
              </PDFViewer>
              <Divider />
            </>
          )}

          {isPreview && (
            <div ref={previewRef}>
              <QuestionFormWebPreview data={data} />
            </div>
          )}
        </div>
        <div className="w-full lg:flex-1 pb-10">
          <TextInput
            className="mb-2"
            leftSectionPointerEvents="none"
            leftSection={icon}
            type="email"
            variant="filled"
            aria-label="Recipient 1"
            placeholder="Recipient 1"
            value={recipient1}
            onChange={(e) => setRecipient1(e.currentTarget.value)}
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
            value={recipient2}
            onChange={(e) => setRecipient2(e.currentTarget.value)}
          />
          <TextInput
            className="mb-4"
            leftSectionPointerEvents="none"
            leftSection={icon}
            type="email"
            variant="filled"
            aria-label="Recipient 3"
            placeholder="Recipient 3: (Optional)"
            value={recipient3}
            onChange={(e) => setRecipient3(e.currentTarget.value)}
          />
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            variant="filled"
            rows={7}
            maxLength={200}
            aria-label="Notes"
            placeholder="Enter any additional notes here..."
          />
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              className="bg-blue-700"
              loading={isSharing}
              disabled={!recipient1}
              onClick={handleShare}
            >
              Share
            </Button>
            <Button
              className="bg-stone-700"
              onClick={() => {
                const url = new URL(window.location.href);
                url.search = isPreview ? "" : "?mode=preview";
                window.location.assign(url);
              }}
            >
              View {isPreview ? "as PDF" : "on Web"}
            </Button>
            {isPreview && (
              <ActionIcon
                size="lg"
                variant="filled"
                className="bg-stone-700"
                aria-label="Download PDF"
                loading={isGeneratingPDF}
                onClick={handleDownloadPDF}
              >
                <Tooltip label="Download PDF">
                  <IconDownload size={18} />
                </Tooltip>
              </ActionIcon>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SavedForm;
