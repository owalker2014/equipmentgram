import React from "react";
import { Title, Text, Button, Container } from "@mantine/core";

type Props = {
  isLanding?: boolean;
};

const WhatWeDo: React.FC<Props> = ({ isLanding = false }) => {
  return (
    <section
      className={`${isLanding ? "bg-blue-50" : "bg-white"} py-10`}
      id="what-we-do"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-10">
          <div className="space-y-2 px-5">
            <Title className="text-blue-700">What We Do</Title>

            <Text c="dimmed" className="">
              EquipmentGram is focused on{" "}
              <span className="font-bold text-gray-700">
                excavator inspections
              </span>
              . Using the EquipmentGram{" "}
              <span className="font-bold text-gray-700">phone app</span>, anyone
              with a phone or tablet can capture excavator component data and
              generate standardized inspection reports. These reports help
              buyers, sellers, and owners make informed decisions and can be
              easily shared.
            </Text>
          </div>
          <div className="space-y-2 px-5">
            <Title className="text-blue-700">Our Mission</Title>

            <Text c="dimmed" className="">
              EquipmentGram's mission is to simplify excavator inspections by
              allowing anyone with a smartphone or tablet to produce an
              inspection report. We aim to reduce uncertainty, save time and
              cost, and help customers get more value from their excavator
              investments.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
