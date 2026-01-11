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
            label: "Limited Function Check (Control Station)",
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
            label: "Limited Function Check (Engine)",
            key: "LimitedFunctionCheckEngine",
          },
        ],
      },
      {
        name: "Drivetrain",
        comment:
          "The operational test is confined to a low-speed, load-free evaluation in a flat area. Full verification of differential interlocks, transmission shifting, and drive axle functionality is not possible. The inspector checks for abnormal noises, observes leaks, and notes physical damage.",
        key: "Drivetrain",
        questions: [
          {
            label: "Transmission",
            key: "Transmission",
          },
          {
            label: "Right Drive Axle",
            key: "RightDriveAxle",
          },
          {
            label: "Rear Tandem (Chain Drives)",
            key: "RearTandemChainDrives",
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
            label: "Hose (Hydraulics)",
            key: "HoseHydraulics",
          },
          {
            label: "Articulation Cylinder",
            key: "ArticulationCylinder",
          },
          {
            label: "Hydraulic Motors",
            key: "HydraulicMotors",
          },
          {
            label: "Blade Lift Cylinders",
            key: "BladeLiftCylinders",
          },
          {
            label: "Blade Angle Cylinders",
            key: "BladeAngleCylinders",
          },
          {
            label: "Blade Side Shift Cylinder",
            key: "BladeSideShiftCylinder",
          },
          {
            label: "Saddle Positioning Cylinders",
            key: "SaddlePositioningCylinders",
          },
          {
            label: "Saddle Lock Pin",
            key: "SaddleLockPin",
          },
          {
            label: "Steering Cylinders",
            key: "SteeringCylinders",
          },
          {
            label: "Wheel Lean Cylinders",
            key: "WheelLeanCylinders",
          },
          {
            label: "Limited Function Check (Hydraulics)",
            key: "LimitedFunctionCheckHydraulics",
          },
        ],
      },
      {
        name: "Chassis",
        comment:
          "Pin connection pivot point wear inspections involve only visual, tactile assessments; no dial indicator tests are conducted.",
        key: "Chassis",
        questions: [
          {
            label: "Y-Frame",
            key: "YFrame",
          },
          {
            label: "Y-Frame Pivot Trunnion",
            key: "YFramePivotTrunnion",
          },
          {
            label: "Blade Tilt Frame (Saddle)",
            key: "BladeTiltFrameSaddle",
          },
          {
            label: "Circle Frame and Brackets",
            key: "CircleFrameAndBrackets",
          },
          {
            label: "Circle Wear Strips",
            key: "CircleWearStrips",
          },
          {
            label: "Circle Support Brackets",
            key: "CircleSupportBrackets",
          },
          {
            label: "Circle Gear Box",
            key: "CircleGearBox",
          },
          {
            label: "Circle Gear",
            key: "CircleGear",
          },
          {
            label: "Mold Board Slide Wear Strip",
            key: "MoldBoardSlideWearStrip",
          },
          {
            label: "Articulating Center Pins",
            key: "ArticulatingCenterPins",
          },
          {
            label: "Front Axle Oscillating Pins",
            key: "FrontAxleOscillatingPins",
          },
          {
            label: "Steering Linkage",
            key: "SteeringLinkage",
          },
          {
            label: "Wheel Tilt Linkage",
            key: "WheelTiltLinkage",
          },
          {
            label: "Belly Pins",
            key: "BellyPins",
          },
          {
            label: "Limited Function Check (Grader)",
            key: "LimitedFunctionCheckGrader",
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
            label: "Left Steer Tire",
            key: "LeftSteerTire",
          },
          {
            label: "Left Front Drive Tires",
            key: "LeftFrontDriveTires",
          },
          {
            label: "Left Rear Drive Tires",
            key: "LeftRearDriveTires",
          },
          {
            label: "Right Rear Drive Tires",
            key: "RightRearDriveTires",
          },
          {
            label: "Right Front Drive Tires",
            key: "RightFrontDriveTires",
          },
          {
            label: "Right Steer Tire",
            key: "RightSteerTire",
          },
          {
            label: "Wheel Condition",
            key: "WheelCondition",
          },
          {
            label: "Wheel Studs, Nuts, Lugs",
            key: "WheelStudsNutsLugs",
          },
        ],
      },
      {
        name: "Specialty",
        comment: undefined,
        key: "Specialty",
        questions: [
          {
            label: "Blade Condition",
            key: "BladeCondition",
          },
          {
            label: "Blade Cutting Edge Condition",
            key: "BladeCuttingEdgeCondition",
          },
          {
            label: "Front Lift Group",
            key: "FrontLiftGroup",
          },
        ],
      },
      // Add more pages and questions here...
    ],
  };

  const add = useAddNewInspectionForm(params.id, user?.uid!);

  const handleSubmit = (data: QuestionForm) => {
    if (!user) return;

    add.mutate({
      createdByUserUid: user.uid,
      form: data,
      type: EquipmentType.Skidsteers,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
