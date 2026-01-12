"use client";

import MultiStepForm from "@/components/Forms/multi-step-form";
import { useAuth } from "@/lib/authContext";
import { QuestionForm, useAddFreshInspectionForm } from "@/lib/network/forms";
import { EquipmentType } from "@/utils/formUtils";
import React, { useCallback } from "react";

const CompactExcavatorsFormPage: React.FC<{
  params: any;
  searchParams: any;
}> = ({ params, searchParams }) => {
  const { user } = useAuth();

  const add = useAddFreshInspectionForm(user?.uid!);

  const questionForm: QuestionForm = {
    pages: [
      {
        name: "General Appearance",
        comment: undefined,
        key: "GeneralAppearance",
        questions: [
          {
            label: "Exterior Light",
            key: "ExteriorLight",
          },
          {
            label: "Paint",
            key: "Paint",
          },
          {
            label: "Glass",
            key: "Glass",
          },
          // don't include this one
          // {
          //   label: "Steps/Ladder",
          //   key: "StepsLadder",
          // },
          // {
          //   label: "Hand Rails",
          //   key: "HandRails",
          // },
          // {
          //   label: "Sheet Metal (Fiberglass Condition)",
          //   key: "SheetMetal",
          // },
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
          // {
          //   label: "Safety Lock Out/Stop",
          //   key: "SafetyLockOutStop",
          // },
          // {
          //   label: "Swing Break",
          //   key: "SwingBreak",
          // },
          // {
          //   label: "Current Safety Manual",
          //   key: "CurrentSafetyManual",
          // },
          // {
          //   label: "Current Operator/Maintenance Manual",
          //   key: "CurrentOperatorMaintenanceManual",
          // },
        ],
      },
      // {
      //   name: "Control Station",
      //   comment: undefined,
      //   key: "ControlStation",
      //   questions: [
      //     {
      //       label: "Seats/Armrests",
      //       key: "SeatsArmrests",
      //     },
      //     {
      //       label: "Mirrors",
      //       key: "Mirrors",
      //     },
      //     {
      //       label: "Steering Controls",
      //       key: "SteeringControls",
      //     },
      //     {
      //       label: "Hydraulic Controls",
      //       key: "HydraulicControls",
      //     },
      //     {
      //       label: "Auxiliary Hydraulic Control",
      //       key: "AuxiliaryHydraulicControl",
      //     },
      //     {
      //       label: "Drivetrain Controls",
      //       key: "DrivetrainControls",
      //     },
      //     {
      //       label: "Dash Console",
      //       key: "DashConsole",
      //     },
      //     {
      //       label: "Engine Oil Pressure",
      //       key: "EngineOilPressure",
      //     },
      //     {
      //       label: "Warning Lights",
      //       key: "WarningLights",
      //     },
      //     {
      //       label: "Gauges",
      //       key: "Gauges",
      //     },
      //     {
      //       label: "Hour Meter",
      //       key: "HourMeter",
      //     },
      //     {
      //       label: "Air Conditioner",
      //       key: "AirConditioner",
      //     },
      //     {
      //       label: "Heater",
      //       key: "Heater",
      //     },
      //     {
      //       label: "Limited Function Check",
      //       key: "LimitedFunctionCheckControlStation",
      //     },
      //   ],
      // },
      // {
      //   name: "Engine",
      //   comment: undefined,
      //   key: "Engine",
      //   questions: [
      //     {
      //       label: "Emissions Label",
      //       key: "EmissionsLabel",
      //     },
      //     {
      //       label: "A/C Compressor",
      //       key: "ACCompressor",
      //     },
      //     {
      //       label: "Starter",
      //       key: "Starter",
      //     },
      //     {
      //       label: "Exhaust System",
      //       key: "ExhaustSystem",
      //     },
      //     {
      //       label: "Radiator",
      //       key: "Radiator",
      //     },
      //     {
      //       label: "Oil Leaks",
      //       key: "OilLeaks",
      //     },
      //     {
      //       label: "Fuel Leaks",
      //       key: "FuelLeaks",
      //     },
      //     {
      //       label: "Cooling System Leaks",
      //       key: "CoolingSystemLeaks",
      //     },
      //     {
      //       label: "Engine - Left Side",
      //       key: "EngineLeftSide",
      //     },
      //     {
      //       label: "Engine - Right Side",
      //       key: "EngineRightSide",
      //     },
      //     {
      //       label: "Limited Function Check",
      //       key: "LimitedFunctionCheckEngine",
      //     },
      //   ],
      // },
      // {
      //   name: "Drivetrain",
      //   comment:
      //     "The operational test is confined to a low-speed, load-free evaluation in a flat area. Full verification of differential interlocks, transmission shifting, and drive axle functionality is not possible. The inspector checks for abnormal noises, observes leaks, and notes physical damage.",
      //   key: "Drivetrain",
      //   questions: [
      //     {
      //       label: "Left Drive Motor",
      //       key: "LeftDriveMotor",
      //     },
      //     {
      //       label: "Right Drive Motor",
      //       key: "RightDriveMotor",
      //     },
      //     {
      //       label: "Left Final Drive",
      //       key: "LeftFinalDrive",
      //     },
      //     {
      //       label: "Right Final Drive",
      //       key: "RightFinalDrive",
      //     },
      //     {
      //       label: "Limited Function Check",
      //       key: "LimitedFunctionCheckDrivetrain",
      //     },
      //   ],
      // },
      // {
      //   name: "Hydraulics",
      //   comment: undefined,
      //   key: "Hydraulics",
      //   questions: [
      //     {
      //       label: "Pump (Hydraulics)",
      //       key: "PumpHydraulics",
      //     },
      //     {
      //       label: "Valves",
      //       key: "Valves",
      //     },
      //     {
      //       label: "Hydraulic Tank",
      //       key: "HydraulicTank",
      //     },
      //     {
      //       label: "Hydraulic Control Pattern Changer",
      //       key: "HydraulicControlPatternChanger",
      //     },
      //     {
      //       label: "Hose (Hydraulics)",
      //       key: "HoseHydraulics",
      //     },
      //     {
      //       label: "Auxiliary Hydraulic Plumbing",
      //       key: "AuxiliaryHydraulicPlumbing",
      //     },
      //     {
      //       label: "Swing Motor",
      //       key: "SwingMotor",
      //     },
      //     {
      //       label: "Hydraulic Center Swivel",
      //       key: "HydraulicCenterSwivel",
      //     },
      //     {
      //       label: "Boom Swing Cylinders",
      //       key: "BoomSwingCylinders",
      //     },
      //     {
      //       label: "Boom Lift Cylinders",
      //       key: "BoomLiftCylinders",
      //     },
      //     {
      //       label: "Stick Cylinder",
      //       key: "StickCylinder",
      //     },
      //     {
      //       label: "Bucket Cylinder",
      //       key: "BucketCylinder",
      //     },
      //     {
      //       label: "Thumb Cylinder",
      //       key: "ThumbCylinder",
      //     },
      //     {
      //       label: "Blade Lift Cylinder",
      //       key: "BladeLiftCylinder",
      //     },
      //     {
      //       label: "Limited Function Check",
      //       key: "LimitedFunctionCheckHydraulics",
      //     },
      //   ],
      // },
      // {
      //   name: "Boom Condition",
      //   comment:
      //     "Inspections for pin connection pivot point wear are limited to visual and tactile assessments; dial indicator tests are not conducted.",
      //   key: "BoomCondition",
      //   questions: [
      //     {
      //       label: "Boom Condition",
      //       key: "BoomCondition",
      //     },
      //     {
      //       label: "Stick Condition",
      //       key: "StickCondition",
      //     },
      //     {
      //       label: "Swing Tower Pivot",
      //       key: "SwingTowerPivot",
      //     },
      //     {
      //       label: "Boom Base Pin and Bushings",
      //       key: "BoomBasePinBushings",
      //     },
      //     {
      //       label: "Pin and Bushings Boom to Stick",
      //       key: "PinBushingsBoomToStick",
      //     },
      //     {
      //       label: "Pin and Bushings Stick to Coupler",
      //       key: "PinBushingsStickToCoupler",
      //     },
      //     {
      //       label: "Turntable Bearing",
      //       key: "TurntableBearing",
      //     },
      //     {
      //       label: "Bottom Covers",
      //       key: "BottomCovers",
      //     },
      //     {
      //       label: "Limited Function Check",
      //       key: "LimitedFunctionCheckBoomCondition",
      //     },
      //   ],
      // },
      // {
      //   name: "Undercarriage",
      //   comment: undefined,
      //   key: "Undercarriage",
      //   questions: [
      //     {
      //       label: "Roller Frames",
      //       key: "RollerFrames",
      //     },
      //     {
      //       label: "Grouser Height Measurement",
      //       key: "GrouserHeightMeasurement",
      //     },
      //     {
      //       label: "Track Belt Condition",
      //       key: "TrackBeltCondition",
      //     },
      //     {
      //       label: "Rubber Belt Drive Lugs",
      //       key: "RubberBeltDriveLugs",
      //     },
      //     {
      //       label: "Track Tensioners",
      //       key: "TrackTensioners",
      //     },
      //     {
      //       label: "Carrier Rollers",
      //       key: "CarrierRollers",
      //     },
      //     {
      //       label: "Front Idler Wear",
      //       key: "FrontIdlerWear",
      //     },
      //     {
      //       label: "Track Rollers",
      //       key: "TrackRollers",
      //     },
      //     {
      //       label: "Sprockets",
      //       key: "Sprockets",
      //     },
      //   ],
      // },
      // {
      //   name: "Specialty",
      //   comment: undefined,
      //   key: "Specialty",
      //   questions: [
      //     {
      //       label: "Excavator Bucket Condition",
      //       key: "ExcavatorBucketCondition",
      //     },
      //     {
      //       label: "Teeth/Adapter",
      //       key: "TeethAdapter",
      //     },
      //     {
      //       label: "Blade Condition",
      //       key: "BladeCondition",
      //     },
      //     {
      //       label: "Blade Cutting Edge Condition",
      //       key: "BladeCuttingEdgeCondition",
      //     },
      //     {
      //       label: "Thumb",
      //       key: "Thumb",
      //     },
      //   ],
      // },
      // Add more pages and questions here...
    ],
  };

  const handleSubmit = useCallback(({ pages, ...others }: QuestionForm) => {
    if (!user) return;

    add.mutate({
      createdByUserUid: user.uid,
      form: { pages },
      type: EquipmentType.CompactExcavator,
      manufacturer: params.id,
      model: searchParams.model,
      ...others,
    });
  }, []);

  return (
    <MultiStepForm
      questionForm={questionForm}
      onSubmit={handleSubmit}
      metadata={{
        equipment_type: EquipmentType.CompactExcavator,
        manufacturer: params.id,
        model: searchParams.model,
      }}
    />
  );
};

export default CompactExcavatorsFormPage;
