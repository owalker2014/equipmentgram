import { useAuth } from "@/lib/authContext";
import { QuestionForm } from "@/lib/network/forms";
import { USStates } from "@/utils/formUtils";
import { Button, Group, Image, Radio, Select, Text, TextInput, Textarea, rem } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UploadFileField from "./upload-file-field";
import { notifications } from "@mantine/notifications";

type Props = {
  questionForm: QuestionForm;
  onSubmit: (formData: QuestionForm) => void;
};

interface QF extends QuestionForm {
  state: string;
  zip: string;
  city: string;
  line1: string;
  line2?: string;
}

const MultiStepForm = ({ questionForm, onSubmit }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    getInputProps,
    onSubmit: handleSubmit,
    setFieldValue,
    validate,
    errors,
    values,
  } = useForm<QF>({
    validate: (values) => {
      if (currentStep === 0) {
        return {
          nameOfBusiness: values.nameOfBusiness ? null : "Name of business is required",
          customerEmail: values.customerEmail ? null : "Customer email is required",
          state: values?.state.length > 0 ? null : "State is required",
          zip: values?.zip.length > 0 ? null : "Zip is required",
          city: values?.city.length > 0 ? null : "City is required",
          line1: values?.line1.length > 0 ? null : "Address line 1 is required",
          dateOfInspection: values.dateOfInspection ? null : "Date of inspection is required",
          timeOfInspection: values.timeOfInspection ? null : "Time of inspection is required",
        };
      }

      // // Follow above pattern to validate rest of the pages
      if (currentStep > 0) {
        return values.pages[currentStep - 1].questions.reduce((acc: Record<string, string>, question, i) => {
          if (!question.value) {
            acc[`pages.${currentStep - 1}.questions.${i}.value`] = "Value is required";
          }

          if (question.value === "Issues" && !question.comment) {
            acc[`pages.${currentStep - 1}.questions.${i}.comment`] = "Comment is required";
          }
          if (!question.imageUrl) {
            acc[`pages.${currentStep - 1}.questions.${i}.imageUrl`] = "Image is required";
          }

          return acc;
        }, {});
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
      notifications.show({
        title: "Form has errors",
        message: "Please fix all errors before submitting",
        color: "red",
      });
    }

    console.log("Final Form Data:", data);
    onSubmit({
      ...data,
      address: {
        line1: data.line1,
        line2: data.line2 || "",
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    });
  };

  const currentQuestions = questionForm.pages[currentStep - 1];

  const { user } = useAuth();

  return (
    <div>
      <form className="max-w-[600px] mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <h2 className="mb-2 text-xl font-bold">{currentQuestions ? currentQuestions.name : "Inspection Report"}</h2>
        {currentQuestions?.comment && <Text className="mb-4">{currentQuestions.comment}</Text>}{" "}
        <ul className="space-y-4">
          {currentStep === 0 && (
            <>
              <TextInput label="Inspector Name" {...getInputProps("inspectorName")} />
              <TextInput label="Name Of Business at Which Inspection Took Place" {...getInputProps("nameOfBusiness")} />
              <TextInput label="Customer Email" {...getInputProps("customerEmail")} />
              <h1 className="text-sm font-bold">Address Of Inspection Location: </h1>
              <TextInput label="Address Line 1" {...getInputProps("line1")} />
              <TextInput label="Address Line 2" {...getInputProps("line2")} />
              <div className="grid grid-cols-3 gap-2">
                <TextInput label="City" {...getInputProps("city")} />
                <Select
                  label="States"
                  data={Object.entries(USStates).map(([stateKey, state]) => state)}
                  {...getInputProps("state")}
                />
                <TextInput label="Zip" {...getInputProps("zip")} />
              </div>
              <DateInput label="Date of Inspection" placeholder="Date input" {...getInputProps("dateOfInspection")} />
              <TimeInput
                label="Time at Which Inspection Took Place"
                leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                placeholder="Time input"
                {...getInputProps("timeOfInspection")}
              />
            </>
          )}
          {currentStep > 0 &&
            questionForm.pages[currentStep - 1].questions.map((question, i) => (
              <div className="p-4 space-y-4  border-gray-200 border border-solid" key={question.key}>
                <div className="radio-group">
                  <Radio.Group
                    label={question.label}
                    {...getInputProps(`pages.${currentStep - 1}.questions.${i}.value`)}
                  >
                    <Group mt="xs">
                      <Radio value="Good" label="Good" />
                      <Radio value="Issues" label="Issues" />
                      <Radio value="N/A" label="N/A" />
                    </Group>
                  </Radio.Group>
                </div>

                <div>
                  <UploadFileField
                    fileName={question.key}
                    onUploadComplete={(url) => {
                      setFieldValue(`pages.${currentStep - 1}.questions.${i}.imageUrl`, url);
                    }}
                    error={errors[`pages.${currentStep - 1}.questions.${i}.imageUrl`]?.toString()}
                  />
                  {values.pages[currentStep - 1].questions[i].imageUrl && (
                    <Image className="mt-4" src={values.pages[currentStep - 1].questions[i].imageUrl} />
                  )}
                  {/* <SimpleGrid className="mt-4" cols={{ base: 1, sm: 4 }}>
                   </SimpleGrid> */}
                </div>
                {values.pages[currentStep - 1].questions[i].value === "Issues" && (
                  <Textarea label="Comment" {...getInputProps(`pages.${currentStep - 1}.questions.${i}.comment`)} />
                )}
              </div>
            ))}
        </ul>
        <div className="pb-10 my-4 space-x-4">
          {currentStep > 0 && <Button onClick={prevStep}>Previous</Button>}
          {currentStep < questionForm.pages.length && <Button onClick={nextStep}>Next</Button>}
          {currentStep === questionForm.pages.length && <Button type="submit">Submit</Button>}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
