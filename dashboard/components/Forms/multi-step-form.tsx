import { useAuth } from "@/lib/authContext";
import { QuestionForm } from "@/lib/network/forms";
import { USStates } from "@/utils/formUtils";
import {
  Button,
  Image,
  Progress,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import UploadFileField from "./upload-file-field";
import { getTimeString, notify } from "@/lib/utils";

type Props = {
  questionForm: QuestionForm;
  onSubmit: (formData: QuestionForm) => void;
  metadata?: {
    equipment_type: string;
    manufacturer: string;
    model: string;
  };
};

interface QF extends QuestionForm {
  state: string;
  zip: string;
  city: string;
  line1: string;
  line2?: string;
}

const MultiStepForm = ({ questionForm, onSubmit, metadata }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const progressRange = useMemo(
    () => Array.from({ length: 99 }, (v, i) => 1 + i),
    [],
  );

  const {
    getInputProps,
    onSubmit: handleSubmit,
    setFieldValue,
    validate,
    errors,
    setErrors,
    clearFieldError,
    values,
  } = useForm<QF>({
    ...{ mode: "uncontrolled" },
    validate: (values) => {
      if (currentStep === 0) {
        return {
          nameOfBusiness: values.nameOfBusiness
            ? null
            : "Name of business is required",
          // customerEmail: values.customerEmail
          //   ? null
          //   : "Customer email is required",
          state: values?.state.length > 0 ? null : "State is required",
          zip: values?.zip.length > 0 ? null : "Zip is required",
          city: values?.city.length > 0 ? null : "City is required",
          line1: values?.line1.length > 0 ? null : "Address line 1 is required",
          // dateOfInspection: values.dateOfInspection
          //   ? null
          //   : "Date of inspection is required",
          // timeOfInspection: values.timeOfInspection
          //   ? null
          //   : "Time of inspection is required",
        };
      }

      // // Follow above pattern to validate rest of the pages
      if (currentStep > 0) {
        return values.pages[currentStep - 1].questions.reduce(
          (acc: Record<string, string>, question, i) => {
            // console.log("question-submitted -->", question);
            // if (!question.value) {
            //   acc[`pages.${currentStep - 1}.questions.${i}.value`] =
            //     "Value is required";
            // }

            if (question.value === "Issues" && !question.comment) {
              acc[`pages.${currentStep - 1}.questions.${i}.comment`] =
                "Comment is required";
            }

            if (!question.imageUrl) {
              acc[`pages.${currentStep - 1}.questions.${i}.imageUrl`] =
                "Image / Snapshot is required";
            }

            return acc;
          },
          {},
        );
      }

      return {};
    },
    initialValues: {
      ...questionForm,
      state: "",
      zip: "",
      city: "",
      line1: "",
      line2: "",
    },
  });

  useEffect(() => {
    if (user && !values.inspectorName) {
      setFieldValue("inspectorName", user.displayName || "");
      setFieldValue("customerEmail", user.email || "");
    }
  }, [user]);

  const nextStep = async () => {
    const { hasErrors, errors } = validate();

    console.log(errors);

    setCurrentStep((prevStep) => {
      if (hasErrors) {
        return prevStep;
      }

      return prevStep + 1;
    });
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const onFormSubmit = (data: QF) => {
    const { hasErrors, errors } = validate();

    if (hasErrors) {
      notify(
        {
          title: "Form has errors",
          message: "Please fix all errors before submitting",
        },
        true,
      );
      return;
    }

    const currentDateTime = new Date().toISOString().split("T");
    onSubmit({
      ...data,
      // removed empty comments
      pages: data.pages.map((page) => ({
        ...page,
        comment: page.comment || "",
      })),
      address: {
        line1: data.line1,
        line2: data.line2 || "",
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
      inspectorName: user?.displayName!,
      customerEmail: user?.email!,
      dateOfInspection: currentDateTime[0],
      timeOfInspection: getTimeString(currentDateTime[1]),
    });
  };

  const currentQuestions = questionForm.pages[currentStep - 1];

  return (
    <div>
      <form
        className="max-w-[600px] mx-auto"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <h2 className="mb-10 text-2xl font-bold uppercase">
          {currentQuestions ? currentQuestions.name : "Inspection Report"}
        </h2>
        <small className="mb-5 block text-sm text-gray-600">
          {currentStep > 0 && (
            <>
              <strong>Step</strong> {currentStep} <strong>of</strong>{" "}
              {questionForm.pages.length}
            </>
          )}
        </small>
        {currentQuestions?.comment && (
          <Text className="mb-4">{currentQuestions.comment}</Text>
        )}{" "}
        <div className="space-y-5">
          {currentStep === 0 && (
            <>
              <TextInput
                label="Inspector Name"
                {...getInputProps("inspectorName")}
                disabled
              />
              <TextInput
                label="Customer Email"
                {...getInputProps("customerEmail")}
                disabled
              />
              <TextInput
                label="Name Of Business at Which Inspection Took Place"
                required
                variant="filled"
                {...getInputProps("nameOfBusiness")}
              />
              <div>
                <h2 className="text-sm font-bold">
                  Address Of Inspection Location:{" "}
                </h2>
                <div className="mb-2 space-y-3">
                  <TextInput
                    label="Address Line 1"
                    required
                    variant="filled"
                    {...getInputProps("line1")}
                  />
                  <TextInput
                    label="Address Line 2"
                    variant="filled"
                    {...getInputProps("line2")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <TextInput
                  label="City"
                  {...getInputProps("city")}
                  required
                  variant="filled"
                />
                <Select
                  label="States"
                  variant="filled"
                  data={Object.entries(USStates).map(
                    ([stateKey, state]) => state,
                  )}
                  required
                  {...getInputProps("state")}
                />
                <TextInput
                  label="Zip"
                  {...getInputProps("zip")}
                  required
                  variant="filled"
                />
              </div>
              {/* <div className="grid grid-cols-2 gap-2">
                <DateInput
                  label="Date of Inspection"
                  placeholder="Date input"
                  {...getInputProps("dateOfInspection")}
                />
                <TimeInput
                  label="Time at Which Inspection Took Place"
                  leftSection={
                    <IconClock
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  placeholder="Time input"
                  {...getInputProps("timeOfInspection")}
                />
              </div> */}
            </>
          )}
          {currentStep > 0 &&
            questionForm.pages[currentStep - 1].questions.map((question, i) => (
              <div
                className="p-4 space-y-4  border-gray-200 border border-solid"
                key={question.key}
              >
                <>
                  <UploadFileField
                    fileName={question.key}
                    fieldLabel={question.label}
                    metadata={{ ...metadata!, section: currentQuestions.name }}
                    onUploadComplete={(url, result) => {
                      setFieldValue(
                        `pages.${currentStep - 1}.questions.${i}.imageUrl`,
                        url,
                      );
                      setFieldValue(
                        `pages.${currentStep - 1}.questions.${i}.imageResult`,
                        result,
                      );
                    }}
                    onProgress={(progress) => {
                      setFieldValue(
                        `pages.${currentStep - 1}.questions.${i}.progress`,
                        progress,
                      );
                    }}
                    onError={(err) => {
                      setErrors({
                        [`pages.${currentStep - 1}.questions.${i}.imageUrl`]:
                          err,
                      });
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
                      value={
                        values.pages[currentStep - 1]?.questions[i]?.progress ??
                        0
                      }
                      striped
                      animated
                    />
                  )}
                  {values.pages[currentStep - 1].questions[i].imageUrl && (
                    <Image
                      className="mt-4 max-h-5"
                      src={values.pages[currentStep - 1].questions[i].imageUrl}
                    />
                  )}
                  {/* <SimpleGrid className="mt-4" cols={{ base: 1, sm: 4 }}>
                   </SimpleGrid> */}
                </>
                {values.pages[currentStep - 1].questions[i].value ===
                  "Issues" && (
                  <Textarea
                    label="Comment"
                    {...getInputProps(
                      `pages.${currentStep - 1}.questions.${i}.comment`,
                    )}
                  />
                )}
              </div>
            ))}
        </div>
        <div className="pb-10 my-4 space-x-4">
          {currentStep > 0 && (
            <Button onClick={prevStep} className="bg-blue-700">
              Previous
            </Button>
          )}
          {currentStep < questionForm.pages.length && (
            <Button onClick={nextStep} className="bg-blue-700">
              Next
            </Button>
          )}
          {currentStep === questionForm.pages.length && (
            <Button type="submit" className="bg-blue-700">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
