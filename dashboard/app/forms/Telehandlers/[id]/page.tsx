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
            label: "Steering Controls",
            key: "SteeringControls",
          },
          {
            label: "Drivetrain Controls",
            key: "DrivetrainControls",
          },
          {
            label: "Transmission Disconnect Control",
            key: "TransmissionDisconnectControl",
          },
          {
            label: "Load Charts",
            key: "LoadCharts",
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
            label: "Hour Meter/Odometer",
            key: "HourMeterOdometer",
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
            label: "DEF/AdBlue Tank",
            key: "DEFAdBlueTank",
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
          "The operational test is limited to low-speed, load-free trials in a confined flat area. Full verification of differential interlocks, transmission shifting, and drive axle functionality isnt feasible. The inspector checks for abnormal noises, leaks, and physical damage.",
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
            label: "Rear Axle Oscillating Pin",
            key: "RearAxleOscillatingPin",
          },
          {
            label: "Final Drivers",
            key: "FinalDrivers",
          },
          {
            label: "Limited Function Check (Engine)",
            key: "LimitedFunctionCheckEngine",
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
            label: "Hose(Hydraulics)",
            key: "HoseHydraulics",
          },
          {
            label: "Auxilliary Hydraulic Plumbing",
            key: "AuxilliaryHydraulicPlumbing",
          },
          {
            label: "Boom Lift Cylinder(s)",
            key: "BoomLiftCylinders",
          },
          {
            label: "Telescope Boom Cylinders",
            key: "TelescopeBoomCylinders",
          },
          {
            label: "Carriage Tilt Cylinders",
            key: "CarriageTiltCylinders",
          },
          {
            label: "Frame Leveling Cylinder",
            key: "FrameLevelingCylinder",
          },
          {
            label: "Steering Cylinders",
            key: "SteeringCylinders",
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
          "Inspections for pivot point wear on pin connections are limited to visual and tactile observations; dial indicator testing is not conducted.",
        key: "Chassis",
        questions: [
          {
            label: "Boom Condition",
            key: "BoomCondition",
          },
          {
            label: "Left Side Boom",
            key: "LeftSideBoom",
          },
          {
            label: "Right Side Boom",
            key: "RightSideBoom",
          },
          {
            label: "Chain/Tensioners",
            key: "ChainTensioners",
          },
          {
            label: "Boom Wear Guides",
            key: "BoomWearGuides",
          },
          {
            label: "Steering Linkage",
            key: "SteeringLinkage",
          },
          {
            label: "Frame Condition",
            key: "FrameCondition",
          },
          {
            label: "Limited Function Check (Chassis)",
            key: "LimitedFunctionCheckChassis",
          },
          {
            label: "Master Cylinder",
            key: "MasterCylinder",
          },
          {
            label: "Brake Control",
            key: "BrakeControl",
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
        ],
      },
      {
        name: "Specialty",
        comment: undefined,
        key: "Specialty",
        questions: [
          {
            label: "Loader Quick Coupler",
            key: "LoaderQuickCoupler",
          },
          {
            label: "Load Back Rest",
            key: "LoadBackRest",
          },
          {
            label: "Fork",
            key: "Fork",
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
      type: EquipmentType.Telehandlers,
    });
  };

  return <MultiStepForm questionForm={questionForm} onSubmit={handleSubmit} />;
};

export default BackhoeLoaderFormPage;

// show the upload button if there is title is "issues", or show a commnets input is the title is "N/A'
