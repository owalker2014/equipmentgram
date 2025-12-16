import {
  IconBackhoe,
  IconBulldozer,
  IconCrane,
  IconFiretruck,
  IconReceipt,
} from "@tabler/icons-react";
import { EquipmentType } from "./formUtils";
import { InspectionFormWithId } from "../lib/network/forms";
import { UserType } from "../lib/network/users";

export const equipments = [
  {
    title: EquipmentType.Backhoe,
    icon: IconBackhoe,
    link: "/Backhoe",
    color: "indigo",
  },
  {
    title: EquipmentType.CompactLoaders,
    icon: IconBackhoe,
    link: "/Compact Loaders",
    color: "blue",
  },
  {
    title: EquipmentType.Dozers,
    icon: IconBulldozer,
    link: "/Dozers",
    color: "green",
  },
  {
    title: EquipmentType.WheelLoaders,
    icon: IconReceipt,
    link: "/Wheel Loaders",
    color: "teal",
  },
  {
    title: EquipmentType.Excavators,
    icon: IconFiretruck,
    link: "/Excavators",
    color: "teal",
  },
  {
    title: EquipmentType.MiniExcavators,
    icon: IconCrane,
    link: "/Mini Excavators",
    color: "cyan",
  },
  {
    title: EquipmentType.Skidsteers,
    icon: IconBackhoe,
    link: "/Skidsteers",
    color: "pink",
  },
  {
    title: EquipmentType.Telehandlers,
    icon: IconBackhoe,
    link: "/Telehandlers",
    color: "red",
  },
  {
    title: EquipmentType.MotorGraders,
    icon: IconBackhoe,
    link: "/Motor Graders",
    color: "orange",
  },
];

export const demoForm: InspectionFormWithId = {
  id: "demo",
  type: EquipmentType.Backhoe,
  createdByUserUid: "8JiX6SVjhVYjvHhDwCq0HT0BxOu2",
  form: {
    pages: [
      {
        name: "Page 1",
        questions: [
          {
            label: "Sheet Metal (Fiberglass) Condition",
            key: "SheetMetalFiberglassCondition",
          },
          {
            key: "Paint",
            label: "Paint",
          },
          {
            key: "Glass",
            label: "Glass",
          },
          {
            key: "StepsLadder",
            label: "Steps/Ladder",
          },
          {
            label: "Hand Rails",
            key: "HandRails",
          },
          {
            key: "ExteriorLights",
            label: "Exterior Lights",
          },
        ],
        key: "Page1",
      },
      {
        key: "Page2",
        questions: [
          {
            value: "Good",
            label: "Travel Alarm",
            key: "TravelAlarm",
          },
          {
            key: "Horn",
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/equipment-fiverr.appspot.com/o/Paint1695752034853Captura%20de%20pantalla%202023-08-22%20015438.png?alt=media&token=4aeaed11-d50d-4632-891a-e667f53ea9a3",
            label: "Horn",
            value: "Issues",
          },
          {
            value: "Issues",
            label: "Seat Belt",
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/equipment-fiverr.appspot.com/o/Glass1695752040808i%20will%20fix%20and%20develop%20your%20asp%20net%20web%20api%2C%20angular%20react%20projects.png?alt=media&token=94fb8ee8-2528-4b80-abe4-2bd83a06ea08",
            key: "SeatBelt",
          },
          {
            label: "Safety Lock Out/Stop",
            key: "SafetyLockOutStop",
            value: "Good",
          },
          {
            value: "Good",
            label: "Current Safety Manual",
            key: "CurrentSafetyManual",
          },
          {
            value: "Issues",
            label: "Current Operator/Maintenance Manual",
            key: "CurrentOperatorMaintenanceManual",
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/equipment-fiverr.appspot.com/o/ExteriorLights1695752046799Screenshot%202022-09-11%20191644.png?alt=media&token=659f6b71-731c-4ebb-b7cf-8b4baa1517f8",
          },
        ],
        name: "Page 2",
      },
      {
        key: "Page3",
        questions: [
          {
            key: "Mirrors",
            comment: "asd asd asd a",
            label: "Mirrors",
            value: "N/A",
          },
          {
            key: "SeatsArmrests",
            label: "Seats/Armrests",
            value: "Good",
          },
          {
            comment: " asdas das das ",
            label: "Hydraulic Controls",
            key: "HydraulicControls",
            value: "N/A",
          },
          {
            key: "BackhoeControlConfiguration",
            value: "Good",
            label: "Backhoe Control Configuration",
          },
          {
            comment: "asd asd asd as",
            label: "Drivetrain Controls",
            value: "N/A",
            key: "DrivetrainControls",
          },
          {
            label: "Dash Console",
            key: "DashConsole",
            value: "Good",
          },
          {
            label: "Engine Oil Pressure",
            key: "EngineOilPressure",
          },
          {
            key: "WarningLights",
            label: "Warning Lights",
          },
          {
            label: "Gauges",
            key: "Gauges",
          },
          {
            key: "HourMeter",
            label: "Hour Meter",
          },
          {
            key: "IndicationofAdditionalHours",
            label: "Indication of Additional Hours",
          },
          {
            label: "Heater",
            key: "Heater",
          },
        ],
        name: "Page 3",
      },
      {
        name: "Page 4",
        key: "Page4",
        questions: [
          {
            key: "BlowBySubjectiveObservation",
            label: "Blow-By (Subjective Observation)",
            value: "Good",
          },
          {
            label: "Starter",
            key: "Starter",
            value: "Good",
          },
          {
            value: "Good",
            label: "Exhaust System",
            key: "ExhaustSystem",
          },
          {
            key: "Radiator",
            label: "Radiator",
            value: "Good",
          },
          {
            label: "Oil Leaks",
            value: "Good",
            key: "OilLeaks",
          },
          {
            label: "Fuel Leaks",
            key: "FuelLeaks",
            value: "Good",
          },
          {
            key: "CoolingSystemLeaks",
            value: "Good",
            label: "Cooling System Leaks",
          },
          {
            key: "EngineLeftSide",
            value: "Good",
            label: "Engine - Left Side",
          },
          {
            label: "Engine - Right Side",
            value: "Good",
            key: "EngineRightSide",
          },
          {
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/equipment-fiverr.appspot.com/o/HourMeter1695752067851352197895_608567111385958_4473469487157437705_n.jpg?alt=media&token=6f5326e5-0230-444a-8102-8ab34a2ff91b",
            comment: " asdas d asd asd asd",
            value: "Issues",
            key: "LimitedFunctionCheck",
            label: "Limited Function Check",
          },
        ],
      },
      {
        key: "Page5",
        questions: [
          {
            value: "Good",
            key: "Transmission",
            label: "Transmission",
          },
          {
            key: "TransferCaseDropBox",
            value: "Good",
            label: "Transfer Case/Drop Box",
          },
          {
            key: "FrontDriveAxle",
            value: "Good",
            label: "Front Drive Axle",
          },
          {
            key: "FrontAxleOscillatingPin",
            value: "Good",
            label: "Front Axle Oscillating Pin",
          },
          {
            value: "Good",
            key: "RearDriveAxle",
            label: "Rear Drive Axle",
          },
          {
            value: "Good",
            key: "FinalDrives",
            label: "Final Drives",
          },
          {
            value: "Good",
            key: "CoolingSystemLeaks",
            label: "Cooling System Leaks",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
            value: "Good",
          },
        ],
        name: "Page 5",
      },
      {
        questions: [
          {
            value: "Good",
            key: "PumpHydraulics",
            label: "Pump (Hydraulics)",
          },
          {
            value: "Good",
            key: "Valves",
            label: "Valves",
          },
          {
            value: "Good",
            label: "Hydraulic Tank",
            key: "HydraulicTank",
          },
          {
            value: "Good",
            label: "Hoses (Hydraulics)",
            key: "HosesHydraulics",
          },
          {
            key: "LoaderLiftCylinders",
            value: "Good",
            label: "Loader Lift Cylinders",
          },
          {
            value: "Good",
            label: "Bucket Tilt Cylinders",
            key: "BucketTiltCylinders",
          },
          {
            key: "OutriggerCylinders",
            label: "Outrigger Cylinders",
            value: "Good",
          },
          {
            key: "BoomSwingCylinders",
            value: "Good",
            label: "Boom Swing Cylinder(s)",
          },
          {
            label: "Boom Lift Cylinder(s)",
            key: "BoomLiftCylinders",
          },
          {
            key: "StickCylinder",
            label: "Stick Cylinder",
          },
          {
            key: "BucketCylinder",
            label: "Bucket Cylinder",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
          },
        ],
        key: "Page6",
        name: "Page 6",
      },
      {
        name: "Page 7",
        key: "Page7",
        questions: [
          {
            key: "SteeringLinkage",
            value: "Good",
            label: "Steering Linkage",
          },
          {
            label: "Master Cylinder",
            key: "MasterCylinder",
            value: "Good",
          },
          {
            key: "ParkBrake",
            value: "Good",
            label: "Park Brake",
          },
          {
            key: "LimitedFunctionCheckBrakes",
            label: "Limited Function Check - Brakes",
            value: "Good",
          },
          {
            key: "FrameCondition",
            label: "Frame Condition",
            value: "Good",
          },
          {
            key: "LeftFrontTire",
            value: "Good",
            label: "Left Front Tire",
          },
          {
            value: "Good",
            key: "LeftRearTire",
            label: "Left Rear Tire",
          },
          {
            key: "RightRearTire",
            label: "Right Rear Tire",
            value: "Good",
          },
          {
            value: "Good",
            label: "Right Front Tire",
            key: "RightFrontTire",
          },
          {
            key: "WheelCondition",
            value: "Good",
            label: "Wheel Condition",
          },
          {
            value: "Good",
            key: "WheelStudsNutsLugs",
            label: "Wheel Studs, Nuts, Lugs",
          },
        ],
      },
      {
        questions: [
          {
            value: "Good",
            key: "LiftArmCondition",
            label: "Lift Arm Condition",
          },
          {
            key: "ChassistoArmPins",
            label: "Chassis to Arm Pins",
            value: "Good",
          },
          {
            value: "Good",
            label: "Tilt Linkage",
            key: "TiltLinkage",
          },
          {
            value: "Good",
            label: "Tilt Linkage Pins and Bushings",
            key: "TiltLinkagePinsandBushings",
          },
          {
            value: "Good",
            key: "BucketToArmPins",
            label: "Bucket To Arm Pins",
          },
          {
            label: "Limited Function Check",
            key: "LimitedFunctionCheck",
            value: "Good",
          },
        ],
        name: "Page 8",
        key: "Page8",
      },
      {
        name: "Page 9",
        key: "Page9",
        questions: [
          {
            value: "Good",
            key: "BoomCondition",
            label: "Boom Condition",
          },
          {
            label: "Stick Condition",
            key: "StickCondition",
            value: "Good",
          },
          {
            label: "Stick Extension Wear Guides",
            key: "StickExtensionWearGuides",
            value: "Good",
          },
          {
            label: "Boom Lock (Backhoe)",
            value: "Good",
            key: "BoomLockBackhoe",
          },
          {
            label: "Swing Tower Pivot",
            value: "Good",
            key: "SwingTowerPivot",
          },
          {
            key: "BoomBasePinandBushings",
            comment: "",
            value: "Issues",
            label: "Boom Base Pin and Bushings",
          },
          {
            key: "PinandBushingsBoomtoStick",
            label: "Pin and Bushings Boom to Stick",
          },
          {
            key: "PinandBushingsSticktoBucket",
            label: "Pin and Bushings Stick to Bucket",
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
        name: "Page 10",
        key: "Page10",
        questions: [
          {
            key: "LoaderBucketCondition",
            label: "Loader Bucket Condition",
            value: "Good",
          },
          {
            label: "Loader Bucket Edge/Shanks",
            key: "LoaderBucketEdgeShanks",
            value: "Good",
          },
          {
            value: "Good",
            key: "BackhoeExcavatorBucketCondition",
            label: "Backhoe/Excavator Bucket Condition",
          },
          {
            value: "Good",
            label: "Backhoe/Excavator Bucket Shanks and Teeth",
            key: "BackhoeExcavatorBucketShanksandTeeth",
          },
        ],
      },
    ],
    nameOfBusiness: "Zorita Tyson",
    dateOfInspection: {
      seconds: 563652000,
      nanoseconds: 0,
    },
    customerEmail: "pasujijo@mailinator.com",
    address: {
      line2: "Tempor ut ad ad offi",
      line1: "331 North Green Second Extension",
      state: "Iowa",
      zip: "76331",
      city: "Doloremque molestias",
    },
    timeOfInspection: "19:55",
  },
  createdByUser: {
    email: "syedshiblimahmud@gmail.com",
    display_name: "Syed Shibli Mahmud",
    photoURL:
      "https://lh3.googleusercontent.com/a/AAcHTtdAKAJ2p0r8HUuaEqXHGfQJSi8m6etBbXgqEz-5gKVypSdc=s96-c",
    emailVerified: true,
    phoneNumber: "+8801712345678",
    id: "8JiX6SVjhVYjvHhDwCq0HT0BxOu2",
    user_id: "8JiX6SVjhVYjvHhDwCq0HT0BxOu2",
    address: {
      city: "Dhaka",
      line1: "Dhaka",
      line2: "Dhaka",
      state: "Dhaka",
      zip: "1212",
    },
    firstName: "Syed",
    jobTitle: "Software Engineer",
    lastName: "Shibli",
    nameOfBusiness: "Shibli Inc",
    type: UserType.inspector,
  },
};
