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
            label: "Paint",
            key: "Paint",
          },
          {
            label: "Sheet Metal (Fiberglass) Condition",
            key: "SheetMetalFiberglassCondition",
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
            label: "Seats/Armrests",
            key: "SeatsArmrests",
          },
          {
            label: "Mirrors",
            key: "Mirrors",
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
            key: "LimitedFunctionCheckControlStation",
          },
        ],
      },
      {
        name: "Engine",
        comment: undefined,
        key: "Engine",
        questions: [
          {
            label: "Emission Label",
            key: "EmissionLabel",
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
            key: "LimitedFunctionCheckEngine",
          },
        ],
      },
      {
        name: "Drivetrain",
        comment: undefined,
        key: "Drivetrain",
        questions: [
          {
            label: "Transmission",
            key: "Transmission",
          },
          {
            label: "Transfer Case/Dropbox",
            key: "TransferCaseDropbox",
          },
          {
            label: "Front Drive Axle",
            key: "FrontDriveAxle",
          },
          {
            label: "Rear Drive Axle",
            key: "RearDriveAxle",
          },
          {
            label: "Final Drives",
            key: "FinalDrives",
          },
          {
            label: "Limited Function Check (Drivetrain)",
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
            label: "Loader Lift Cylinders",
            key: "LoaderLiftCylinders",
          },
          {
            label: "Bucket Tilt Cylinders",
            key: "BucketTiltCylinders",
          },
          {
            label: "Auxilliary Hydraulic Plumbing",
            key: "AuxilliaryHydraulicPlumbing",
          },
          {
            label: "Steering Cylinders",
            key: "SteeringCylinders",
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
          "Inspections for pin connection pivot point wear are restricted to observations based on sound, sight, and touch; dial indicator testing is omitted from the process.",
        key: "Chassis",
        questions: [
          {
            label: "Articulating Center Pins",
            key: "ArticulatingCenterPins",
          },
          {
            label: "Brake Type",
            key: "BrakeType",
          },
          {
            label: "Master Cylinder",
            key: "MasterCylinder",
          },
          {
            label: "Brake Lines/Hoses",
            key: "BrakeLinesHoses",
          },
          {
            label: "Park Brake",
            key: "ParkBrake",
          },
          {
            label: "Limited Function Check (Brakes)",
            key: "LimitedFunctionCheckBrakes",
          },
          {
            label: "Frame Condition",
            key: "FrameCondition",
          },
          {
            label: "Tire Brands",
            key: "TireBrands",
          },
          {
            label: "Left Front Tire",
            key: "LeftFrontTire",
          },
          {
            label: "Left Rear Tire",
            key: "LeftRearTire",
          },
          {
            label: "Right Rear Tire",
            key: "RightRearTire",
          },
          {
            label: "Right Front Tire",
            key: "RightFrontTire",
          },
          {
            label: "Wheel Condition",
            key: "WheelCondition",
          },
          {
            label: "Wheel Studs, Nuts, Lugs",
            key: "WheelStudsNutsLugs",
          },
          {
            label: "Left Arm Condition",
            key: "LeftArmCondition",
          },
          {
            label: "Chassis to Arm Pin",
            key: "ChassisToArmPin",
          },
          {
            label: "Tilt Linkage",
            key: "TiltLinkage",
          },
          {
            label: "Tilt Linkage Pins and Bushings",
            key: "TiltLinkagePinsBushings",
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
        name: "Specialty",
        comment: undefined,
        key: "Specialty",
        questions: [
          {
            label: "Loader Bucket Condition",
            key: "LoaderBucketCondition",
          },
          {
            label: "Loader Bucket Cutting Edge/Shank/Teeth",
            key: "LoaderBucketCuttingEdgeShankTeeth",
          },
          {
            label: "Loader Quick Coupler",
            key: "LoaderQuickCoupler",
          },
          {
            label: "Forks",
            key: "Forks",
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
      type: EquipmentType.WheelLoaders,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
