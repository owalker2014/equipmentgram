import {
  DocumentData,
  DocumentReference,
  FieldValue,
  serverTimestamp,
} from "@firebase/firestore";
import { Button, Checkbox, Select, TextInput, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
import * as yup from "yup";
import { useAuth } from "../../lib/authContext";
import { useAddInspectionRequest } from "../../lib/network/inspection-requests";
import { Step } from "./StepWidget";
import {
  EquipmentManufacturer,
  equipmentsInScope,
  EquipmentType,
  USStates,
} from "./formUtils";
import { InspectionReportStatus } from "@/lib/network/forms";

export type InspectionRequestObject = {
  user_id: string;
  inspectorRef?: DocumentReference<DocumentData>;
  firstName: string;
  lastName: string;
  businessName?: string;
  email: string;
  mobile: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  date: Date;
  equipmentType: EquipmentType;
  equipmentManufacturer: EquipmentManufacturer;
  equipmentModel?: string;
  equipmentSerialNumber: string;
  readFAQReceipt: boolean;
  notes?: string;
  step: Step;
  created: FieldValue;
  canceled: boolean;
  reportStatus?: InspectionReportStatus;
};

const schema = yup.object().shape({
  firstName: yup.string().required("You must provide a first name"),
  lastName: yup.string().required("You must provide a last name"),
  businessName: yup.string(),
  email: yup.string().email().required("You must provide an email"),
  mobile: yup.string().required("You must provide a mobile number"),
  streetAddress: yup.string().required("You must provide a street address"),
  city: yup.string().required("You must provide a city"),
  state: yup.string().required("You must provide a state"),
  postalCode: yup.string().required("You must provide a postal code"),
  date: yup.date().required("You must provide a date"),
  equipmentType: yup.string().required("You must provide an equipment type"),
  equipmentManufacturer: yup
    .string()
    .required("You must provide an equipment manufacturer"),
  equipmentModel: yup.string(),
  equipmentSerialNumber: yup
    .string()
    .required("You must provide a serial number"),
  readFAQReceipt: yup
    .boolean()
    .required("You must agree to the terms and conditions"),
  notes: yup.string(),
});

export const InspectionRequestForm = () => {
  const { user } = useAuth();
  const {
    mutateAsync,
    isLoading: isMutationLoading,
    isError: isMutationError,
  } = useAddInspectionRequest();

  const { getInputProps, onSubmit } = useForm<InspectionRequestObject>({
    validate: yupResolver(schema),
  });

  const onHandleSubmit = async (data: InspectionRequestObject) => {
    if (!user) return;

    const inspectionRequest: InspectionRequestObject = {
      ...data,
      user_id: user.claims.user_id,
      step: Step.Payment,
      created: serverTimestamp(),
      canceled: false,
    };

    try {
      await mutateAsync(inspectionRequest);
    } catch (e) {
      console.error("Mutation failed", e);
    }
  };

  return (
    <div className="py-2 lg:py-[10px]">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
              <span className="block mb-2 text-lg font-semibold text-primary">
                Read Our FAQ
              </span>
              <h2 className="text-dark mb-4 text-3xl font-bold sm:text-4xl md:text-[40px]">
                Inspection Request Form
              </h2>
              <p className="text-base text-body-color">
                Fill the form below to request a heavy equipment inspection.
              </p>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={onSubmit(onHandleSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="First Name"
                leftSection={<IconUser />}
                {...getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                leftSection={<IconUser />}
                {...getInputProps("lastName")}
              />
              <TextInput
                label="Business Name"
                {...getInputProps("businessName")}
              />
              <TextInput
                label="Email"
                type="email"
                {...getInputProps("email")}
              />
              <TextInput
                label="Street Address"
                {...getInputProps("streetAddress")}
              />

              {/* <AddressInput
                onAddressSelect={(address) => {
                  setFieldValue("streetAddress", address?.streetAddress);
                }}
                placeholder="Search for your address"
                address={values.streetAddress}
                setAddress={(address) => setFieldValue("streetAddress", address)}
              /> */}
              <div className="grid grid-cols-3 gap-4">
                <TextInput label="City" {...getInputProps("city")} />
                <Select
                  label="State"
                  data={Object.entries(USStates).map(([statekey, state]) => ({
                    value: state,
                    label: state,
                  }))}
                  {...getInputProps("state")}
                />
                <TextInput
                  label="Postal Code"
                  {...getInputProps("postalCode")}
                />
              </div>
              <TextInput
                type="number"
                label="Mobile"
                {...getInputProps("mobile")}
              />

              <DatePickerInput
                label=" When will the inspection take place?"
                placeholder="Pick date"
                {...getInputProps("date")}
              />
              <Select
                label="Equipment Type"
                data={Object.entries(EquipmentType)
                  .filter(([statekey, state]) =>
                    equipmentsInScope.includes(state)
                  )
                  .map(([statekey, state]) => ({
                    value: state,
                    label: state,
                  }))}
                {...getInputProps("equipmentType")}
              />
              <Select
                label="Equipment Manufacturer"
                data={Object.entries(EquipmentManufacturer).map(
                  ([statekey, state]) => ({
                    value: state,
                    label: state,
                  })
                )}
                {...getInputProps("equipmentManufacturer")}
              />
              <TextInput
                label="Equipment Serial Number"
                {...getInputProps("equipmentSerialNumber")}
              />
              <TextInput
                label="Equipment Model"
                {...getInputProps("equipmentModel")}
              />
              <Textarea
                className="col-span-2"
                label=" Notes or Special Instructions"
                {...getInputProps("notes")}
              />
              <Checkbox
                className="col-span-2"
                mr={10}
                label=" I agree that I have read and understood EquipmentGram's inspection terms and conditions by
                reading the FAQ and other information on the website."
                {...getInputProps("readFAQReceipt")}
              />
            </div>
            <div className="text-center">
              <Button
                className="my-10 text-center"
                type="submit"
                loading={isMutationLoading}
                size="lg"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
