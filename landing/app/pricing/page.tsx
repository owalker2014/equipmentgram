"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import Head from "next/head";

type Props = {};

const features = [
  {
    name: "General Appearance",
    available: true,
  },
  {
    name: "Engine ",
    available: true,
  },
  {
    name: "Chassis ",
    available: true,
  },
  {
    name: "Safety ",
    available: true,
  },
  {
    name: "Drivetrain ",
    available: true,
  },
  {
    name: "Specialty ",
    available: true,
  },
  {
    name: "Control Station ",
    available: true,
  },
  {
    name: "Hydraulics ",
    available: true,
  },
];

const Pricing = (props: Props) => {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL!;

  return (
    <>
      <Head>
        <title>EquipmentGram - Pricing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-10 container px-4 mx-auto max-w-screen-xl">
        <div className="flex items-center justify-center flex-col gap-10">
          <h1 className="text-4xl font-bold text-gray-900 ">
            Pricing Details for An Inspection Report
          </h1>
          <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg  sm:p-8">
            <h5 className="mb-4 text-xl font-medium text-gray-500 ">
              Standard plan
            </h5>
            <div className="flex items-baseline text-gray-900 ">
              <span className="text-3xl font-semibold">$</span>
              <span className="text-5xl font-extrabold tracking-tight">
                699
              </span>
              <span className="ml-1 text-xl font-normal text-gray-500 ">
                /inspection
              </span>
            </div>
            <ul className="space-y-5 my-7">
              <p className="uppercase  font-bold">Inspection of</p>
              {features.map((feature, index) => (
                <li key={index} className="flex space-x-3 items-center">
                  <svg
                    className={`flex-shrink-0 w-4 h-4 ${
                      feature.available ? "text-blue-600 " : "text-gray-400 "
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1
                                        1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                    />
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 ">
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Link href={dashboardUrl}>
              <Button fullWidth>Produce a Report</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
