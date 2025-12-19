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
              EquipmentGram is your trusted partner when it comes to evaluating
              the condition and history of construction equipment. We work with
              a network of dedicated inspectors who meticulously assess heavy
              machinery and provide detailed inspection reports. These reports
              help you make informed decisions, whether you're looking to buy,
              sell, or maintain your equipment.
            </Text>
          </div>
          <div className="space-y-2 px-5">
            <Title className="text-blue-700">Our Mission</Title>

            <Text c="dimmed" className="">
              EquipmentGram is here to bridge the gap between the world of
              construction equipment inspections and technology. Our mission is
              to simplify the equipment inspection process, save customers time
              and money, and to ensure that customers get the most out of their
              investments.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
