// "use client";

import { useMediaCapture } from "@/lib/hooks/use-media-capture";
import { InspectionResult } from "@/lib/network/forms";
import { FileInput } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";

type Props = {
  onCaptured: (_url: string, file: File, _result: InspectionResult) => void;
  fileName: string;
  fieldLabel: string;
  error?: string;
  metadata: {
    equipment_type: string;
    manufacturer: string;
    model: string;
    section: string;
  };
  onProgress: (_progress: number) => void;
  onError: (_err: string) => void;
  clearFieldError: () => void;
};

const UploadFileField = ({
  onCaptured,
  fileName,
  fieldLabel: component,
  error,
  metadata,
  onProgress,
  onError,
  clearFieldError,
}: Props) => {
  const { capture, loading } = useMediaCapture({
    fileName,
    component,
    metadata,
    onCaptured,
    onProgress,
    onError,
    clearFieldError,
  });

  // for debugging
  // console.log('inspection-meta ---> ', { ...metadata, component });

  return (
    <>
      <FileInput
        accept="image/png,image/jpeg,image/heic,image/heif"
        capture="environment"
        disabled={loading}
        label={component}
        {...{ placeholder: component }}
        description={`capture an image for ${component}`}
        onChange={capture}
        // onProgress={(e) => onProgress(e.eventPhase)}
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
