import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/sections/how-it-works";

export const metadata: Metadata = {
  title: "EquipmentGram - How it Works",
};

type Props = {};

const HowItWorks = (props: Props) => {
  return (
    <>
      <HowItWorksSection />
    </>
  );
};

export default HowItWorks;
