"use client";

import CustomLoader from "@/components/Loader";
import { InspectionRequestForm } from "@/components/forms/InspectionRequestForm";
import PaymentStep from "@/components/payment-step";
import { getDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { Step, StepWidget } from "../../components/forms/StepWidget";
import { useAuth } from "../../lib/authContext";
import {
  InspectionRequestObjectWithId,
  useInspectionRequestsForUser,
} from "../../lib/network/inspection-requests";
import { User } from "../../lib/network/users";

const InspectionRequest = () => {
  const { user, loading } = useAuth();

  if (loading) return <CustomLoader />;

  if (!user) {
    return (
      <div className="container px-4 mx-auto max-w-screen-xl">
        <section className="overflow-hidden py-10 lg:py-[80px]">
          <div className="px-4 mx-auto sm:container">
            <StepWidget step={Step.Request} />
          </div>
        </section>
        <section className="flex items-center justify-center py-2 bg-gray">
          <div className="container mx-auto">
            <div className="mx-auto max-w-[600px] rounded-[10px] bg-white p-10 text-center shadow-card md:py-[55px] md:px-[70px]">
              <div className="mx-auto text-center mb-14">
                <img
                  src="/schedule.svg"
                  alt="Schedule image"
                  className="w-full max-w-full mx-auto"
                />
              </div>
              <h2 className="mb-3 text-2xl font-semibold text-black sm:text-3xl">
                Please log in to continue.
              </h2>
              <p className="mb-5 text-base text-body-color">
                You must be logged in to request an inspection. Please log in to
                continue.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const {
    data: inspectionRequestsForUser,
    isLoading: inspectionRequestsForUserLoading,
  } = useInspectionRequestsForUser(user?.claims.user_id);
  const [inspectionRequest, setInspectionRequest] = useState<
    InspectionRequestObjectWithId | undefined
  >(undefined);
  const [inspector, setInspector] = useState<User | undefined>(undefined);
  const [step, setStep] = useState<Step>(Step.Request);

  // Modify the step based on server side state
  useEffect(() => {
    // If use is not logged in, or has not inspection requests, they are in the request state
    if (inspectionRequestsForUser && inspectionRequestsForUser?.length === 0) {
      setStep(Step.Request);
    } else {
      const inspectionRequest = inspectionRequestsForUser?.[0];
      setInspectionRequest(inspectionRequest);
      switch (inspectionRequest?.step) {
        case Step.Schedule:
          setStep(Step.Schedule);
          break;
        case Step.Payment:
          setStep(Step.Payment);
          break;
        case Step.Inspection:
          setStep(Step.Inspection);
          break;
        case Step.Results:
          setStep(Step.Results);
          break;
        case Step.Complete:
          setStep(Step.Complete);
          break;
        default:
          setStep(Step.Request);
          break;
      }
    }
  }, [inspectionRequestsForUser]);

  useEffect(() => {
    if (inspectionRequest?.inspectorRef) {
      getDoc(inspectionRequest.inspectorRef).then((doc) =>
        setInspector(doc.data() as User)
      );
    }
  }, [inspectionRequest]);

  if (inspectionRequestsForUserLoading) return <CustomLoader />;

  return (
    <div className="container px-4 mx-auto max-w-screen-xl">
      <section className="overflow-hidden py-10 lg:py-[80px]">
        <div className="px-4 mx-auto sm:container">
          <StepWidget step={step} />
        </div>
      </section>
      {step === Step.Payment && inspectionRequest && (
        <PaymentStep inspectionRequest={inspectionRequest} />
      )}
      {step === Step.Request && <InspectionRequestForm />}
      {step === Step.Schedule && (
        <section className="flex items-center justify-center py-2 bg-gray">
          <div className="container mx-auto">
            <div className="mx-auto max-w-[600px] rounded-[10px] bg-white p-10 text-center shadow-card md:py-[55px] md:px-[70px]">
              <div className="mx-auto text-center mb-14">
                <img
                  src="/schedule.svg"
                  alt="Schedule image"
                  className="w-full max-w-full mx-auto"
                />
              </div>
              <h2 className="mb-3 text-2xl font-semibold text-black sm:text-3xl">
                We have received your request.
              </h2>
              <p className="mb-5 text-base text-body-color">
                Please allow 24-48 hours for us to review your request and
                schedule your inspection. We will send you an email with the
                details of your inspection once it has been scheduled.
              </p>
              {/* <CancelInspectionRequest inspectionRequest={inspectionRequest!} /> */}
            </div>
          </div>
        </section>
      )}
      {step === Step.Inspection && (
        <section className="flex items-center justify-center py-2 bg-gray">
          <div className="container mx-auto">
            <div className="mx-auto max-w-[600px] rounded-[10px] bg-white p-10 text-center shadow-card md:py-[55px] md:px-[70px]">
              <div className="mx-auto text-center mb-14">
                <img
                  src="/inspector.svg"
                  alt="Inspector image"
                  className="w-full max-w-full mx-auto"
                />
              </div>
              <h2 className="mb-3 text-2xl font-semibold text-black sm:text-3xl">
                An inspector is on their way!
              </h2>
              <p className="mb-5 text-base text-body-color">
                {inspector?.display_name || "The Inspector"} will be arriving at
                your property {inspectionRequest?.streetAddress} at 10:00 AM on{" "}
                {/* @ts-ignore */}
                {inspectionRequest?.date?.toDate().toLocaleDateString()}. Please
                be available to meet them at the front door.
              </p>
              {/* <CancelInspectionRequest inspectionRequest={inspectionRequest!} /> */}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default InspectionRequest;
