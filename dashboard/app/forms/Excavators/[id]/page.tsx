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
            label: "Swing Break",
            key: "SwingBreak",
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
          "The operational test is confined to low-speed assessment in a flat area without a load, preventing full verification of differential interlocks, transmission shifting, and drive axle functionality. During the test, the inspector checks for abnormal noises, observes for leaks, and records any physical damage.",
        key: "Drivetrain",
        questions: [
          {
            label: "Left Drive Motor",
            key: "LeftDriveMotor",
          },
          {
            label: "Right Drive Motor",
            key: "RightDriveMotor",
          },
          {
            label: "Left Final Drive",
            key: "LeftFinalDrive",
          },
          {
            label: "Right Final Drive",
            key: "RightFinalDrive",
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
            label: "Hydraulic Control Pattern Changer",
            key: "HydraulicControlPatternChanger",
          },
          {
            label: "Hose(Hydraulics)",
            key: "HoseHydraulics",
          },
          {
            label: "Hydraulic Center Swivel",
            key: "HydraulicCenterSwivel",
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
            label: "Limited Function Check (Hydraulics)",
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
            label: "Boom Condition",
            key: "BoomCondition",
          },
          {
            label: "Stick Condition",
            key: "StickCondition",
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
            label: "Turntable Bearning",
            key: "TurntableBearing",
          },
          {
            label: "Bottom Covers",
            key: "BottomCovers",
          },
          {
            label: "Limited Function Check (Chassis)",
            key: "LimitedFunctionCheckChassis",
          },
        ],
      },
      {
        name: "Undercarriage",
        comment: undefined,
        key: "Undercarriage",
        questions: [
          {
            label: "Left Roller Frame",
            key: "LeftRollerFrame",
          },
          {
            label: "Left Track Tensioner",
            key: "LeftTrackTensioner",
          },
          {
            label: "Left Track Pads",
            key: "LeftTrackPads",
          },
          {
            label: "Left Grouser Height",
            key: "LeftGrouserHeight",
          },
          {
            label: "Left Track Links",
            key: "LeftTrackLinks",
          },
          {
            label: "Left Track Bushings",
            key: "LeftTrackBushings",
          },
          {
            label: "Left Carrier Roller",
            key: "LeftCarrierRoller",
          },
          {
            label: "Left Track Rollers",
            key: "LeftTrackRollers",
          },
          {
            label: "Left Idler",
            key: "LeftIdler",
          },
          {
            label: "Left Sprocket",
            key: "LeftSprocket",
          },
          {
            label: "Right Roller Frame",
            key: "RightRollerFrame",
          },
          {
            label: "Right Track Tensioner",
            key: "RightTrackTensioner",
          },
          {
            label: "Right Track Pads",
            key: "RightTrackPads",
          },
          {
            label: "Right Grouser Height",
            key: "RightGrouserHeight",
          },
          {
            label: "Right Track Links",
            key: "RightTrackLinks",
          },
          {
            label: "Right Track Bushings",
            key: "RightTrackBushings",
          },
          {
            label: "Right Carrier Roller",
            key: "RightCarrierRoller",
          },
          {
            label: "Right Track Rollers",
            key: "RightTrackRollers",
          },
          {
            label: "Right Idler",
            key: "RightIdler",
          },
          {
            label: "Right Sprocket",
            key: "RightSprocket",
          },
        ],
      },
      {
        name: "Specialty",
        comment: undefined,
        key: "Specialty",
        questions: [
          {
            label: "Excavator Bucket Condition",
            key: "ExcavatorBucketCondition",
          },
          {
            label: "Teeth/Adapter",
            key: "TeethAdapter",
          },
          {
            label: "Thumb",
            key: "Thumb",
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
      type: EquipmentType.Excavators,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
