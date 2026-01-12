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
            label: "Hydraulic Controls",
            key: "HydraulicControls",
          },
          {
            label: "Backhoe Control Configuration",
            key: "BackhoeControlConfiguration",
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
            label: "Indication of Additional Hours",
            key: "IndicationOfAdditionalHours",
          },
          {
            label: "Heater",
            key: "Heater",
          },
        ],
      },
      {
        name: "Engine",
        key: "Engine",
        questions: [
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
          "The operational test is constrained to slow, load-free trials within a confined flat space, limiting the full verification of differential interlocks, complete transmission shifting, and drive axle functionality. The inspector primarily focuses on detecting unusual sounds, spotting leaks, and documenting physical damage.",
        key: "Drivetrain",
        questions: [
          {
            label: "Transmission",
            key: "Transmission",
          },
          {
            label: "Transfer Case/Drop Box",
            key: "TransferCaseDropBox",
          },
          {
            label: "Front Drive Axle",
            key: "FrontDriveAxle",
          },
          {
            label: "Front Axle Oscillating Pin",
            key: "FrontAxleOscillatingPin",
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
            label: "Cooling System Leaks",
            key: "CoolingSystemLeaks",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
        ],
      },
      {
        name: "Hydraulics",
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
            label: "Outrigger Cylinders",
            key: "OutriggerCylinders",
          },
          {
            label: "Boom Swing Cylinder(s)",
            key: "BoomSwingCylinders",
          },
          {
            label: "Boom Lift Cylinder(s)",
            key: "BoomLiftCylinders",
          },
          {
            label: "Stick Cylinder",
            key: "StickCylinder",
          },
          {
            label: "Bucket Cylinder",
            key: "BucketCylinder",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
        ],
      },
      {
        name: "Chassis",
        key: "Chassis",
        questions: [
          {
            label: "Steering Linkage",
            key: "SteeringLinkage",
          },
          {
            label: "Master Cylinder",
            key: "MasterCylinder",
          },
          {
            label: "Park Brake",
            key: "ParkBrake",
          },
          {
            label: "Limited Function Check - Brakes",
            key: "LimitedFunctionCheckBrakes",
          },
          {
            label: "Frame Condition",
            key: "FrameCondition",
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
            label: "Lift Arm Condition",
            key: "LiftArmCondition",
          },
          {
            label: "Chassis to Arm Pins",
            key: "ChassisToArmPins",
          },
          {
            label: "Tilt Linkage",
            key: "TiltLinkage",
          },
          {
            label: "Tilt Linkage Pins and Bushings",
            key: "TiltLinkagePinsAndBushings",
          },
          {
            label: "Bucket To Arm Pins",
            key: "BucketToArmPins",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
          {
            label: "Boom Condition",
            key: "BoomCondition",
          },
          {
            label: "Stick Condition",
            key: "StickCondition",
          },
          {
            label: "Stick Extension Wear Guides",
            key: "StickExtensionWearGuides",
          },
          {
            label: "Boom Lock (Backhoe)",
            key: "BoomLockBackhoe",
          },
          {
            label: "Swing Tower Pivot",
            key: "SwingTowerPivot",
          },
          {
            label: "Boom Base Pin and Bushings",
            key: "BoomBasePinAndBushings",
          },
          {
            label: "Pin and Bushings Boom to Stick",
            key: "PinAndBushingsBoomToStick",
          },
          {
            label: "Pin and Bushings Stick to Bucket",
            key: "PinAndBushingsStickToBucket",
          },
          {
            label: "Outriggers",
            key: "Outriggers",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
        ],
      },
      {
        name: "Specialty",
        key: "Specialty",
        questions: [
          {
            label: "Loader Bucket Condition",
            key: "LoaderBucketCondition",
          },
          {
            label: "Loader Bucket Edge/Shanks",
            key: "LoaderBucketEdgeShanks",
          },
          {
            label: "Backhoe/Excavator Bucket Condition",
            key: "BackhoeExcavatorBucketCondition",
          },
          {
            label: "Backhoe/Excavator Bucket Shanks and Teeth",
            key: "BackhoeExcavatorBucketShanksAndTeeth",
          },
          {
            label: "Rear Quick Coupler",
            key: "RearQuickCoupler",
          },
        ],
      },
    ],
  };

  const handleSubmit = (data: QuestionForm) => {
    console.log("+++++ FORM DATA ++++++", data);

    if (!user) return;

    add.mutate({
      createdByUserUid: user.uid,
      form: data,
      type: EquipmentType.Backhoe,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
