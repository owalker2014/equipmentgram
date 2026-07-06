"use client";

import CustomLoader from "@/components/CustomLoader";
import MultiStepForm from "@/components/Forms/multi-step-form";
import { useAuth } from "@/lib/authContext";
import { useGetEquipmentSections } from "@/lib/network/equipment";
import { QuestionForm, useAddFreshInspectionForm } from "@/lib/network/forms";
import { notify } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const InspectionMultiStepFormPage: React.FC<{
  params: any;
  searchParams: any;
}> = ({ params, searchParams }) => {
  const { user } = useAuth();
  const navigation = useRouter();
  const { manufacturer, model } = searchParams;
  const { data, isLoading: isLoadingSections } = useGetEquipmentSections(
    params.equipmentType,
    manufacturer,
    model,
  );

  const add = useAddFreshInspectionForm(user?.uid!, {
    onSuccess: (data, variables) => {
      notify(
        {
          title: "Inspection Submission Successful",
          message: `Inspection record created successfully for \n
              ${variables.type} > ${variables.manufacturer} > ${variables.model}`,
        },
        false,
      );
      navigation.push(
        `/forms-saved/${variables.type_id}/${data.id}?mode=preview`,
      );
    },
    onError: (error: any) => {
      // console.error("error adding inspection --> ", error);
      notify(
        {
          title: "Inspection Submission Error",
          message:
            error.message ??
            "Error on submitting inspection form. Please try again later.",
        },
        true,
      );
    },
  });

  const handleSubmit = useCallback(({ pages, ...others }: QuestionForm) => {
    if (!user) return;

    add.mutate({
      createdByUserUid: user.uid,
      form: { pages },
      type: data?.equipmentType.label!,
      type_id: params.equipmentType,
      manufacturer: data?.manufacturer?.label!,
      manufacturer_id: manufacturer,
      model: data?.model?.label!,
      model_id: model,
      ...others,
    });
  }, []);

  if (isLoadingSections) {
    return <CustomLoader message="Loading Sections" type="dots" size={20} />;
  }

  return (
    <MultiStepForm
      questionForm={{ pages: data?.data } as QuestionForm}
      onSubmit={handleSubmit}
      metadata={{
        equipment_type: data?.equipmentType.label!,
        manufacturer: data?.manufacturer?.label!,
        model: data?.model?.label!,
      }}
    />
  );
};

export default InspectionMultiStepFormPage;
