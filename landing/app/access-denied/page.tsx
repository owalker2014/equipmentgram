import React from "react";

type Props = {};

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EquipmentGram - Access Denied",
};

const AccessDenied = (props: Props) => {
  return (
    <div>
      <div className=" w-full px-16 md:px-0 my-40 min-h-full flex items-center justify-center">
        <div className="bg-white border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 ">
          <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">401</p>
          <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-red-400 mt-4">Access Denied</p>
          <p className="text-gray-500 mt-8 py-2 border-y-2 text-center">
            Whoops, looks like you don&apos;t have access to this page. Please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
