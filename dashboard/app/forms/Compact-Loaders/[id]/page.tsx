"use client";

import MultiStepForm from "@/components/Forms/multi-step-form";
import { useAuth } from "@/lib/authContext";
import { QuestionForm, useAddNewInspectionForm } from "@/lib/network/forms";
import { EquipmentType } from "@/utils/formUtils";
import React from "react";

const BackhoeLoaderFormPage: React.FC<{
  params: any;
  searchParams: any;
}> = ({ params, searchParams }) => {
  const { user } = useAuth();

  const add = useAddNewInspectionForm(params.id, user?.uid!);
  const questionForm: QuestionForm = {
    pages: [
      {
        name: "General Appearance",
        comment: undefined,
        key: "GeneralAppearance",
        questions: [
          {
            label: "Sheet Metal (Fiberglass) Condition",
            key: "SheetMetalFiberglassCondition",
          },
          {
            label: "Paint",
            key: "Paint",
          },
          {
            label: "Glass",
            key: "Glass",
          },
          {
            label: "Steps/Ladder",
            key: "StepsLadder",
          },
          {
            label: "Hand Rails",
            key: "HandRails",
          },
          {
            label: "Exterior Lights",
            key: "ExteriorLights",
          },
        ],
      },
      {
        name: "Safety",
        comment: undefined,
        key: "Safety",
        questions: [
          {
            label: "Travel Alarm",
            key: "TravelAlarm",
          },
          {
            label: "Horn",
            key: "Horn",
          },
          {
            label: "Seat Belt",
            key: "SeatBelt",
          },
          {
            label: "Safety Lock Out/Stop",
            key: "SafetyLockOutStop",
          },
          {
            label: "Current Safety Manual",
            key: "CurrentSafetyManual",
          },
          {
            label: "Current Operator/Maintenance Manual",
            key: "CurrentOperatorMaintenanceManual",
          },
        ],
      },
      {
        name: "Control Station",
        comment: undefined,
        key: "ControlStation",
        questions: [
          {
            label: "Mirrors",
            key: "Mirrors",
          },
          {
            label: "Seats/Armrests",
            key: "SeatsArmrests",
          },
          {
            label: "Steering Controls",
            key: "SteeringControls",
          },
          {
            label: "Hydraulic Controls",
            key: "HydraulicControls",
          },
          {
            label: "Auxilliary Hydraulic Control",
            key: "AuxilliaryHydraulicControl",
          },
          {
            label: "Drivetrain Controls",
            key: "DrivetrainControls",
          },
          {
            label: "Dash Console",
            key: "DashConsole",
          },
          {
            label: "Engine Oil Pressure",
            key: "EngineOilPressure",
          },
          {
            label: "Warning Lights",
            key: "WarningLights",
          },
          {
            label: "Gauges",
            key: "Gauges",
          },
          {
            label: "Hour Meter",
            key: "HourMeter",
          },
          {
            label: "Air Conditioner",
            key: "AirConditioner",
          },
          {
            label: "Heater",
            key: "Heater",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
        ],
      },
      {
        name: "Engine",
        comment: undefined,
        key: "Engine",
        questions: [
          {
            label: "Emissions Label",
            key: "EmissionsLabel",
          },
          {
            label: "A/C Compressor",
            key: "ACCompressor",
          },
          {
            label: "Blow-By (Subjective Observation)",
            key: "BlowBySubjectiveObservation",
          },
          {
            label: "Starter",
            key: "Starter",
          },
          {
            label: "Exhaust System",
            key: "ExhaustSystem",
          },
          {
            label: "Radiator",
            key: "Radiator",
          },
          {
            label: "Oil Leaks",
            key: "OilLeaks",
          },
          {
            label: "Fuel Leaks",
            key: "FuelLeaks",
          },
          {
            label: "Cooling System Leaks",
            key: "CoolingSystemLeaks",
          },
          {
            label: "Engine - Left Side",
            key: "EngineLeftSide",
          },
          {
            label: "Engine - Right Side",
            key: "EngineRightSide",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
        ],
      },
      {
        name: "Drivetrain",
        comment:
          "The operational test is constrained to low speeds within a confined, flat area, and it does not involve carrying a load. Complete verification of differential interlocks, full transmission shifting, and the functionality of all drive axles is not possible during this test. The inspector primarily relies on listening for unusual sounds, observing any leaks, and documenting any physical damage.",
        key: "Drivetrain",
        questions: [
          {
            label: "Drive Motors",
            key: "DriveMotors",
          },
          {
            label: "Final Drives",
            key: "FinalDrives",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheckDrivetrain",
          },
        ],
      },
      {
        name: "Hydraulics",
        comment: undefined,
        key: "Hydraulics",
        questions: [
          {
            label: "Pump (Hydraulics)",
            key: "PumpHydraulics",
          },
          {
            label: "Valves",
            key: "Valves",
          },
          {
            label: "Hydraulic Tank",
            key: "HydraulicTank",
          },
          {
            label: "Hoses (Hydraulics)",
            key: "HosesHydraulics",
          },
          {
            label: "Auxilliary Hydraulic Plumbing",
            key: "AuxilliaryHydraulicPlumbing",
          },
          {
            label: "Loader Lift Cylinders",
            key: "LoaderLiftCylinders",
          },
          {
            label: "Bucket Tilt Cylinders",
            key: "BucketTiltCylinders",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheckHydraulics",
          },
        ],
      },
      {
        name: "Chassis",
        comment:
          "Pivot point wear inspections for pin connections are conducted through visual, auditory, and tactile observations, without the use of a dial indicator.",
        key: "Chassis",
        questions: [
          {
            label: "Frame Condition",
            key: "FrameCondition",
          },
          {
            label: "Belly Pans",
            key: "BellyPans",
          },
          {
            label: "Lift Arm Condition",
            key: "LiftArmCondition",
          },
          {
            label: "Chassis to Arm Pin",
            key: "ChassisToArmPin",
          },
          {
            label: "Quick Coupler to Arm Pins",
            key: "QuickCouplerToArmPins",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheckChassis",
          },
        ],
      },
      {
        name: "Rubber Track Undercarriage",
        comment: undefined,
        key: "RubberTrackUndercarriage",
        questions: [
          {
            label: "Roller Frames",
            key: "RollerFrames",
          },
          {
            label: "Grouse Height Measurement",
            key: "GrouseHeightMeasurement",
          },
          {
            label: "Track Belt Condition",
            key: "TrackBeltCondition",
          },
          {
            label: "Rubber Belt Drive Lugs",
            key: "RubberBeltDriveLugs",
          },
          {
            label: "Track Tensionners",
            key: "TrackTensionners",
          },
          {
            label: "Front Idler Wear",
            key: "FrontIdlerWear",
          },
          {
            label: "Rear Idler Wear",
            key: "RearIdlerWear",
          },
          {
            label: "Track Rollers",
            key: "TrackRollers",
          },
          {
            label: "Sprockets",
            key: "Sprockets",
          },
        ],
      },
      {
        name: "Speciality",
        comment: undefined,
        key: "Speciality",
        questions: [
          {
            label: "Quick Coupler",
            key: "QuickCoupler",
          },
          {
            label: "Loader Bucket Condition",
            key: "LoaderBucketCondition",
          },
          {
            label: "Loader Bucket Cutting Edge/Shank/Teeth",
            key: "LoaderBucketCuttingEdgeShankTeeth",
          },
        ],
      },
    ],
  };

  const handleSubmit = (data: QuestionForm) => {
    if (!user) return;

    add.mutate({
      createdByUserUid: user.uid,
      form: data,
      type: EquipmentType.CompactLoaders,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
