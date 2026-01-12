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
            label: "Hydraulic Controls",
            key: "HydraulicControls",
          },
          {
            label: "Crawler Dozer Control Configuration",
            key: "CrawlerDozerControlConfiguration",
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
            key: "LimitedFunctionCheckEngine",
          },
        ],
      },
      {
        name: "Drivetrain",
        comment:
          "The operational test is limited to low-speed, load-free conditions in a confined, flat area. Full verification of differential interlocks, transmission shifting, and drive axle functionality isn’t possible. The inspector checks for abnormal noises, leaks, and physical damage.",
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
            label: "Limited Function Check (Drivetrain - Track)",
            key: "LimitedFunctionCheckDrivetrainTrack",
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
            label: "Blade Lift Cylinder",
            key: "BladeLiftCylinder",
          },
          {
            label: "Blade Tilt Cylinder",
            key: "BladeTiltCylinder",
          },
          {
            label: "Ripper Cylinders",
            key: "RipperCylinders",
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
            label: "Blade Condition",
            key: "BladeCondition",
          },
          {
            label: "Blade Cutting Edge Condition",
            key: "BladeCuttingEdgeCondition",
          },
          {
            label: "Ripper Condition",
            key: "RipperCondition",
          },
          {
            label: "Push Arm/C-Frame Condition",
            key: "PushArmCFrameCondition",
          },
          {
            label: "Push Arm Pivot/C-Frame Condition",
            key: "PushArmPivotCFrameCondition",
          },
          {
            label: "Tilt Linkage and Bushings",
            key: "TiltLinkageAndBushings",
          },
          {
            label: "Blade Trunnions/Bushings",
            key: "BladeTrunnionsBushings",
          },
          {
            label: "Limited Function Check (Dozer)",
            key: "LimitedFunctionCheckDozer",
          },
          {
            label: "Frame Condition",
            key: "FrameCondition",
          },
          {
            label: "Belly Pans",
            key: "BellyPans",
          },
        ],
      },
      {
        name: "Undercarriage",
        comment: undefined,
        key: "Undercarriage",
        questions: [
          {
            label: "Pivot Shafts",
            key: "PivotShafts",
          },
          {
            label: "Equalizer Bar Pivot Points",
            key: "EqualizerBarPivotPoints",
          },
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
            label: "Left Grouser Heights",
            key: "LeftGrouserHeights",
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
            label: "Left Front Idler",
            key: "LeftFrontIdler",
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
            label: "Right Carrier Rollers",
            key: "RightCarrierRollers",
          },
          {
            label: "Right Track Rollers",
            key: "RightTrackRollers",
          },
          {
            label: "Right Front Idler",
            key: "RightFrontIdler",
          },
          {
            label: "Right Sprocket",
            key: "RightSprocket",
          },
        ],
      },
      // Add more pages and questions here...
    ],
  };

  const handleSubmit = (data: QuestionForm) => {
    if (!user) return;

    add.mutate({
      createdByUserUid: user.uid,
      form: data,
      type: EquipmentType.Dozers,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
