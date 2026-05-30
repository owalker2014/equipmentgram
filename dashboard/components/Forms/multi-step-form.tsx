import { produce, setAutoFreeze } from "immer";
import { useAuth } from "@/lib/authContext";
import { QuestionForm, runInspections } from "@/lib/network/forms";
import { USStates } from "@/utils/formUtils";
import {
  Button,
  Divider,
  Select,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { getTimeString, notify } from "@/lib/utils";
import { ComponentCaptureBox } from "./component-capture-box";

// very important to prevent immer from freezing our form state,
// which causes mantine form's getInputProps to break when we set values after file upload
setAutoFreeze(false);

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
  const [nextStepLoading, setNextStepLoading] = useState(false);
  const { user } = useAuth();

  const {
    getInputProps,
    onSubmit: handleSubmit,
    setValues,
    setFieldValue,
    validate,
    errors,
    setErrors,
    setFieldError,
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

            if (!question.imageUrl && question.required) {
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
    const { hasErrors } = validate();
    if (hasErrors) return;

    if (currentStep > 0) {
      const sectionSubmissions = values.pages[currentStep - 1];
      const isLastStep = currentStep === questionForm.pages.length;

      const data: Record<string, { file: File; component: string }> = {};
      sectionSubmissions.questions.reduce((a, q, i) => {
        if (q.file) {
          a[`pages.${currentStep - 1}.questions.${i}`] = {
            file: q.file,
            component: q.label,
          };
        }
        return a;
      }, data);

      if (Object.keys(data).length === 0) {
        if (isLastStep) return; // because of onFormSubmit handler
        setCurrentStep((prev) => prev + 1);
        return;
      }

      setNextStepLoading(true);
      try {
        const { errors: batchErrors, results } = await runInspections(
          Object.values(data).map((q) => q.file),
          Object.values(data).map((q) => q.component),
          { ...metadata!, section: sectionSubmissions.name },
        );

        if (batchErrors || !results) {
          // setErrors({
          //   [`pages.${currentStep - 1}.questions.${i}.imageUrl`]: err,
          // });
          setErrors(
            sectionSubmissions.questions.reduce(
              (acc: Record<string, string>, question, i) => {
                if (!data[`pages.${currentStep - 1}.questions.${i}`])
                  return acc;
                acc[`pages.${currentStep - 1}.questions.${i}.imageUrl`] =
                  `Inspection Error [${question.label}]`;
                return acc;
              },
              {},
            ),
          );
          return;
        }

        if (results) {
          const { component_results, ...otherData } = results;
          let submittedIndex = 0;
          const sectionResponses = sectionSubmissions.questions.map((q, i) => {
            delete q.file;
            q.imageResult = !data[`pages.${currentStep - 1}.questions.${i}`]
              ? undefined
              : { ...component_results?.[submittedIndex++], ...otherData };
            return q;
          });
          setValues(
            produce((draft) => {
              draft.pages![currentStep - 1].questions = sectionResponses;
            }),
          );
        }
      } finally {
        setNextStepLoading(false);
      }

      if (isLastStep) return; // because of onFormSubmit handler
    }

    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const onFormSubmit = async (data: QF) => {
    const { hasErrors } = validate();

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

    await nextStep(); // run inspection on last section before submitting

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
        className="max-w-[600px]x mx-autox"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Title size={30}>
          <span className="mb-1 text-2xlx font-boldx uppercasex">
            {currentQuestions ? currentQuestions.name : "Inspection Report"}
          </span>
          <small className="mb-1 block text-sm text-gray-600">
            {currentStep > 0 && (
              <>
                <strong>Step</strong> {currentStep} <strong>of</strong>{" "}
                {questionForm.pages.length}
              </>
            )}
            &nbsp;
          </small>
        </Title>
        <Divider className="mb-7" />
        {currentQuestions?.comment && (
          <Text className="mb-4">{currentQuestions.comment}</Text>
        )}{" "}
        <div className="space-y-3">
          {currentStep === 0 && (
            <div className="max-w-[600px] grid grid-rows-1 gap-2">
              <TextInput
                label="Inspector Name"
                {...getInputProps("inspectorName")}
                styles={{
                  label: { fontWeight: "bold" },
                }}
                disabled
              />
              <TextInput
                label="Customer Email"
                {...getInputProps("customerEmail")}
                styles={{
                  label: { fontWeight: "bold" },
                }}
                disabled
              />
              <TextInput
                label="Name Of Business at Which Inspection Took Place"
                required
                variant="filled"
                {...getInputProps("nameOfBusiness")}
                styles={{
                  label: { fontWeight: "bold" },
                }}
              />
              <div>
                <h2 className="text-sm font-bold mt-2">
                  Address Of Inspection Location:{" "}
                </h2>
                <div className="mb-2 space-y-3">
                  <TextInput
                    label="Address Line 1"
                    required
                    variant="filled"
                    {...getInputProps("line1")}
                    styles={{
                      label: { fontWeight: "bold" },
                    }}
                  />
                  <TextInput
                    label="Address Line 2"
                    variant="filled"
                    {...getInputProps("line2")}
                    styles={{
                      label: { fontWeight: "bold" },
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <TextInput
                  label="City"
                  {...getInputProps("city")}
                  styles={{
                    label: { fontWeight: "bold" },
                  }}
                  required
                  variant="filled"
                />
                <Select
                  label="States"
                  variant="filled"
                  data={Object.entries(USStates).map(
                    ([_stateKey, state]) => state,
                  )}
                  required
                  {...getInputProps("state")}
                  styles={{
                    label: { fontWeight: "bold" },
                  }}
                />
                <TextInput
                  label="Zip"
                  {...getInputProps("zip")}
                  styles={{
                    label: { fontWeight: "bold" },
                  }}
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
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-3">
            {currentStep > 0 &&
              currentQuestions.questions.map((question, i) => (
                <ComponentCaptureBox
                  key={question.key}
                  question={question}
                  currentStep={currentStep}
                  metadata={metadata!}
                  currentQuestions={currentQuestions}
                  form={{
                    getInputProps,
                    setValues,
                    setFieldValue,
                    errors,
                    setFieldError,
                    clearFieldError,
                    values,
                  }}
                  questionIndex={i}
                />
              ))}
          </div>
        </div>
        <div className="pb-10 my-4 space-x-4">
          {currentStep > 0 && (
            <Button
              onClick={prevStep}
              className="bg-stone-700"
              disabled={nextStepLoading}
            >
              Previous
            </Button>
          )}
          {currentStep < questionForm.pages.length && (
            <Button
              onClick={nextStep}
              className="bg-blue-700"
              loading={nextStepLoading}
              disabled={nextStepLoading}
            >
              Next
            </Button>
          )}
          {currentStep === questionForm.pages.length && (
            <Button
              type="submit"
              className="bg-blue-700"
              loading={nextStepLoading}
              disabled={nextStepLoading}
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
