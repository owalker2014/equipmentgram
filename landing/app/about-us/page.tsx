import { Feature, FeaturesGrid } from "@/components/sections/about-us/feature";
import WhatWeDo from "@/components/sections/about-us/what-we-do";
import React from "react";

import type { Metadata } from "next";
import { Divider } from "@mantine/core";

export const metadata: Metadata = {
  title: "EquipmentGram - About Us",
};

type Props = {};

const AboutUs = (props: Props) => {
  return (
    <>
      <WhatWeDo />
      <Divider />
      <FeaturesGrid />
    </>
  );
};

export default AboutUs;
