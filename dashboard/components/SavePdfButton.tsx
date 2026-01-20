import { InspectionFormWithId } from "@/lib/network/forms";
import { Button } from "@mantine/core";
import { PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import { useState } from "react";
import QuestionFormPDF from "./QuestionFormPDF";

type Props = {
  inspectionForm: InspectionFormWithId;
};

function SavePdfButton({ inspectionForm }: Props) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  return (
    <div>
      {isButtonClicked ? (
        <PDFDownloadLink
          document={<QuestionFormPDF data={inspectionForm} />}
          fileName={`${inspectionForm.id}.pdf`}
        >
          {({ blob, url, loading, error }) => (
            <Button
              loading={loading}
              size="xs"
              variant="outline"
              className="text-blue-700"
            >
              Download PDF
            </Button>
          )}
        </PDFDownloadLink>
      ) : (
        <Button
          size="xs"
          variant="outline"
          className="text-blue-700"
          onClick={() => setIsButtonClicked(true)}
        >
          Generate PDF
        </Button>
      )}
    </div>
  );
}
export default SavePdfButton;
