import React, { useMemo } from "react";
import { Progress, Image, Textarea } from "@mantine/core";
import { produce } from "immer";
import UploadFileField from "./upload-file-field";
import { QuestionForm } from "@/lib/network/forms";
import { UseFormReturnType } from "@mantine/form";

interface QF extends QuestionForm {
  state: string;
  zip: string;
  city: string;
  line1: string;
  line2?: string;
}

interface ComponentCaptureBoxProps {
  question: any;
  currentQuestions: any;
  currentStep: number;
  form: Pick<
    UseFormReturnType<QF>,
    | "setValues"
    | "values"
    | "errors"
    | "setFieldValue"
    | "setFieldError"
    | "clearFieldError"
    | "getInputProps"
  >;
  metadata: {
    equipment_type: string;
    manufacturer: string;
    model: string;
  };
  questionIndex: number;
}

export function ComponentCaptureBox({
  question,
  currentQuestions,
  currentStep,
  form: {
    setValues,
    values,
    errors,
    setFieldValue,
    setFieldError,
    clearFieldError,
    getInputProps,
  },
  metadata,
  questionIndex: i,
}: ComponentCaptureBoxProps) {
  const progressRange = useMemo(
    () => Array.from({ length: 99 }, (_v, i) => 1 + i),
    [],
  );

  return (
    <div
      className="p-4 space-y-4 border-gray-200 border border-solid rounded-md"
      key={question.key}
    >
      <div className="flex flex-row gap-3">
        <div className="flex-grow">
          <UploadFileField
            fileName={question.key}
            fieldLabel={question.label}
            metadata={{
              ...metadata!,
              section: currentQuestions.name,
            }}
            onCaptured={(url, file, result) => {
              setValues(
                produce((draft) => {
                  draft.pages![currentStep - 1].questions[i].imageUrl = url;
                  draft.pages![currentStep - 1].questions[i].file = file;
                  // draft.pages![currentStep - 1].questions[i]!.imageResult =
                  //   result;
                }),
              );
            }}
            onProgress={(progress) => {
              setFieldValue(
                `pages.${currentStep - 1}.questions.${i}.progress`,
                progress,
              );
            }}
            onError={(err) => {
              setFieldError(
                `pages.${currentStep - 1}.questions.${i}.imageUrl`,
                err,
              );
            }}
            clearFieldError={() =>
              clearFieldError(
                `pages.${currentStep - 1}.questions.${i}.imageUrl`,
              )
            }
            error={errors[
              `pages.${currentStep - 1}.questions.${i}.imageUrl`
            ]?.toString()}
          />

          {progressRange.includes(
            values.pages[currentStep - 1]?.questions[i]?.progress ?? 0,
          ) && (
            <Progress
              value={values.pages[currentStep - 1]?.questions[i]?.progress ?? 0}
              className="bg-stone-700"
              striped
              animated
            />
          )}
        </div>
        <div className="w-1/5 max-h-20 h-full mt-2 bg-gray-100 overflow-hidden flex items-center justify-center text-center p-2">
          {values.pages[currentStep - 1].questions[i].imageUrl ? (
            <Image
              {...{ alt: "eq-image" }}
              className="max-w-full max-h-fullx object-contain"
              src={values.pages[currentStep - 1].questions[i].imageUrl}
            />
          ) : (
            <span className="text-sm text-stone-500 py-8">Preview</span>
          )}
          {/* <SimpleGrid className="mt-4" cols={{ base: 1, sm: 4 }}></SimpleGrid> */}
        </div>
      </div>
      {values.pages[currentStep - 1].questions[i].value === "Issues" && (
        <Textarea
          label="Comment"
          {...getInputProps(`pages.${currentStep - 1}.questions.${i}.comment`)}
        />
      )}
    </div>
  );
}
