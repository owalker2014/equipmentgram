"use client";

import { Accordion, List, Title } from "@mantine/core";
import React, { useState } from "react";

type Props = {};

const faqItems = [
  {
    question: "What is EquipmentGram?",
    answer: (
      <>
        EquipmentGram is an AI-powered inspection platform that generates
        standardized construction equipment inspection reports using smartphone
        or tablet images.
      </>
    ),
  },
  {
    question: "How does EquipmentGram work?",
    answer: (
      <>
        Users capture images of equipment components with a smartphone or
        tablet. EquipmentGram's AI analyzes those images and produces structured
        inspection reports.
      </>
    ),
  },
  {
    question: "What is the purpose of EquipmentGram's service?",
    answer: (
      <>
        To increase transparency, reduce risk, and standardize how construction
        equipment is inspected, bought, and sold.
      </>
    ),
  },
  {
    question: "What types of construction equipment does EquipmentGram cover?",
    answer: (
      <>
        EquipmentGram currently focuses on excavators, with expansion planned
        for additional heavy-equipment categories.
        {/* <p className="mb-4">
          EquipmentGram inspects the following type of equipment for now:
        </p>
        <List withPadding listStyleType="disc">
          <List.Item>Backhoe</List.Item>
          <List.Item>Compact Loader</List.Item>
          <List.Item>Dozers</List.Item>
          <List.Item>Wheel Loaders</List.Item>
          <List.Item>Excavators</List.Item>
          <List.Item>Mini Excavators</List.Item>
          <List.Item>Skidsteers</List.Item>
          <List.Item>Telehandlers</List.Item>
          <List.Item>Motor Graders</List.Item>
        </List>
        <p className="mt-4">
          In the future, EquipmentGram may add more equipment types and
          categories.
        </p> */}
      </>
    ),
  },
  {
    question: "How can I access EquipmentGram's inspection reports?",
    answer: (
      <>
        Reports are accessible digitally through a secure web portal from which
        inspection reports can be shared with buyers, sellers, dealers, or
        insurers.
      </>
    ),
  },
  {
    question: "Who performs the inspections for EquipmentGram?",
    answer: (
      <>
        Inspections are performed by users capturing images in the field using
        their smartphones or tablets, which are then analyzed by EquipmentGram's
        AI inspection system.
      </>
    ),
  },
  {
    question:
      "What information is included in an EquipmentGram inspection report?",
    answer: (
      <>
        <p className="mb-4">
          Each inspection report would include information about the following:
        </p>
        <List withPadding listStyleType="disc">
          <List.Item>General Appearance</List.Item>
          <List.Item>Engine</List.Item>
          <List.Item>Chassis</List.Item>
          <List.Item>Safety</List.Item>
          <List.Item>Drivetrain</List.Item>
          <List.Item>Specialty</List.Item>
          <List.Item>Control Station</List.Item>
          <List.Item>Hydraulics</List.Item>
        </List>
      </>
    ),
  },
  {
    question:
      "How frequently are inspections conducted on construction equipment?",
    answer: (
      <>
        Inspections can be conducted on-demand whenever a user needs an
        inspection by simply bringing out their smartphone or tablet to conduct
        an inspection.
      </>
    ),
  },
  {
    question: "Can individuals and businesses access EquipmentGram's reports?",
    answer: (
      <>
        Yes. EquipmentGram is designed for individuals, dealers, contractors,
        and businesses.
      </>
    ),
  },
  {
    question:
      "What are the benefits of using EquipmentGram for buying construction equipment?",
    answer: (
      <>
        Improved transparency, reduced fraud risk, standardized reporting, and
        greater confidence in purchase decisions.
        {/* <p className="mb-4">
          Each inspection report would include information about the following:
        </p>
        <List withPadding listStyleType="disc">
          <List.Item>
            <strong> Transparency:</strong> Empowers buyers with information and
            trust to make informed and confident purchasing decisions possible.
          </List.Item>
          <List.Item>
            <strong> Quality Assurance:</strong> Ensures that the equipment
            being bought and sold is in good condition, as it directly impacts
            the buyers/sellers' experience and long-term satisfaction.
          </List.Item>
          <List.Item>
            <strong> Risk Mitigation:</strong> Reduced risk means buyers/sellers
            are less likely to face unexpected expenses or downtime due to
            equipment issues.
          </List.Item>
          <List.Item>
            <strong> Insurance Benefits:</strong> Some insurance companies may
            offer better rates for equipment with documented inspection reports.
          </List.Item>
          <List.Item>
            <strong> Standardization:</strong> Providing standardized inspection
            reports simplifies the buying/selling process and enhances the
            efficiency of the marketplace.
          </List.Item>
          <List.Item>
            <strong> Credibility:</strong> The involvement of professional
            inspectors instills confidence in the accuracy of the inspection
            reports, making the service more trustworthy.
          </List.Item>
          <List.Item>
            <strong> Peace of Mind:</strong> Offering buyers/sellers peace of
            mind is a valuable benefit, as it reduces stress and anxiety
            associated with significant purchases.
          </List.Item>
          <List.Item>
            <strong> Market Efficiency:</strong> Streamlining the buying and
            selling process in the construction equipment market benefits all
            parties involved and enhances overall market efficiency.
          </List.Item>
          <List.Item>
            <strong> Improved Resale Value:</strong> For sellers, having an
            EquipmentGram inspection report can help justify a higher resale
            price.
          </List.Item>
          <List.Item>
            <strong> Reduced Fraud:</strong> Helps reduce the likelihood of
            fraud and misrepresentation of equipment condition.
          </List.Item>
          <List.Item>
            <strong> Regulatory Compliance:</strong> Ensures that equipment
            meets all necessary regulatory and safety standards.
          </List.Item>
          <List.Item>
            <strong> Long-Term Reliability:</strong> Buyers can expect better
            long-term reliability and durability from equipment with documented
            inspections.
          </List.Item>
        </List> */}
      </>
    ),
  },
  {
    question:
      "What is the process for disputing the information in an inspection report?",
    answer: (
      <>
        Users can submit feedback or supporting evidence through the platform
        for review.
      </>
    ),
  },
  {
    question: "Is EquipmentGram's information up-to-date and reliable?",
    answer: (
      <>
        Yes. Reports are generated in real time based on current image data
        captured during each inspection.
      </>
    ),
  },
  {
    question: "Do you offer any API or integration options for businesses?",
    answer: (
      <>
        API and integration options are planned for enterprise and partner use
        cases.
      </>
    ),
  },
  {
    question: "What payment methods are accepted for EquipmentGram's services?",
    answer: (
      <>
        Payment options depend on the service tier and will be presented during
        checkout.
      </>
    ),
  },
  {
    question: "Is there a mobile app available for EquipmentGram?",
    answer: (
      <>
        EquipmentGram is accessible on smartphones and tablets via a
        mobile-optimized web experience, with dedicated apps planned.
      </>
    ),
  },
  {
    question:
      "Can I provide feedback or suggestions for improving EquipmentGram's service?",
    answer: (
      <>
        Yes. Feedback and suggestions are welcome and can be submitted directly
        through the platform or via contact channels.
      </>
    ),
  },
];

const FaqPage = (props: Props) => {
  return (
    <div className="container max-w-screen-lg mx-auto my-10 px-4">
      <Title ta="center">Frequently Asked Questions</Title>

      <div className="mt-10">
        <Accordion variant="separated">
          {faqItems.map((item, index) => (
            <Accordion.Item key={`faq-${index}`} value={item.question}>
              <Accordion.Control>
                <div className="font-medium text-xl">
                  {index + 1}.&nbsp;{item.question}
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <div className="">{item.answer}</div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FaqPage;

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <button
        className="flex justify-between items-center w-full"
        onClick={toggleAnswer}
      >
        <div className="text-lg font-semibold">{question}</div>
        <div className="text-gray-600">{isOpen ? "-" : "+"}</div>
      </button>
      {isOpen && <p className="mt-2 text-gray-700">{answer}</p>}
    </div>
  );
};
