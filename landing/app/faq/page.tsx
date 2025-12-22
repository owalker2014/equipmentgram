"use client";

import { Accordion, List, Title } from "@mantine/core";
import React, { useState } from "react";

type Props = {};

const faqItems = [
  {
    question: "1. What is EquipmentGram?",
    answer:
      "EquipmentGram is a construction and heavy equipment inspection service that can be described as “Car Fax for constriction equipment.” ",
  },
  {
    question: "2. How does EquipmentGram work?",
    answer: (
      <div>
        When a customer wants construction or heavy equipment inspected, they
        would go onto the EquipmentGram website where they would sign up for an
        EquipmentGram account for free and would then fill out an inspection
        request form. On the form, they would provide information such as where
        the inspection would take place, the time when it would take place, and
        the kind of equipment that would be inspected. <br /> With that
        information received, EquipmentGram would dispatch an inspector at the
        time and place requested. <br /> Once the inspection is finished, the
        full inspection report will be available to customers on their dashboard
        account. From their account, they can carry out activities like sending
        out their reports, etc and would have a full log of all reports they
        ever requested for.
      </div>
    ),
  },
  {
    question: "3. What is the purpose of EquipmentGram's service?",
    answer: (
      <div>
        The purposes of the reports are many. Customers can use the reports when
        buying and selling equipment or even when financing the sale of
        equipment. At the most, the report serves the purpose of a third party
        giving an objective assessment of the state of construction and heavy
        equipment.
      </div>
    ),
  },
  {
    question:
      "4. What types of construction equipment does EquipmentGram cover?",
    answer: (
      <div>
        <p className="mb-4">
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
        </p>
      </div>
    ),
  },
  {
    question: "5. How can I access EquipmentGram's inspection reports?",
    answer:
      "The EquipmentGram inspection reports will be sent to your inbox once its ready and it would also be permanently available on the account dashboard which each customer signs up for. ",
  },
  {
    question: "6. Who performs the inspections for EquipmentGram?",
    answer:
      "The inspections would be carried out in the meantime by equipment inspectors who would come to the location requested by customers for the equipment inspections. ",
  },
  {
    question:
      "7. What information is included in an EquipmentGram inspection report?",
    answer: (
      <div>
        <p className="mb-4">
          Each inspection report would include information about the following:
        </p>
        <List withPadding listStyleType="disc">
          <List.Item>General Appearance</List.Item>
          <List.Item>Engine </List.Item>
          <List.Item>Chassis </List.Item>
          <List.Item>Safety </List.Item>
          <List.Item>Drivetrain </List.Item>
          <List.Item>Specialty </List.Item>
          <List.Item>Control Station</List.Item>
          <List.Item>Hydraulics </List.Item>
        </List>
      </div>
    ),
  },
  {
    question:
      "8. How frequently are inspections conducted on construction equipment?",
    answer:
      "Inspections can be conducted as often as requested by customers. If customers want to have inspections done every month, every week, or even every day, EquipmentGram would accommodate such. For such arrangements, contact EquipmentGram we can offer special discounts and arrangements. ",
  },
  {
    question:
      "9. Can individuals and businesses access EquipmentGram's reports?",
    answer:
      "Yes! EquipmentGram is open to both individuals with individuals and businesses having access to account dashboards. ",
  },
  {
    question:
      "10. What are the benefits of using EquipmentGram for buying construction equipment?",
    answer: (
      <div>
        <p className="mb-4">
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
        </List>
      </div>
    ),
  },
  {
    question:
      "11. What is the process for disputing the information in an inspection report?",
    answer:
      "EquipmentGram gives a period for accepting reports. Once reports have been accepted by customers, they can't be disputed. ",
  },
  {
    question: "12. Is EquipmentGram's information up-to-date and reliable?",
    answer:
      "EquipmentGram Reports are as up-to-date as when last an inspection was conducted. EquipmentGram bears no responsibility to make sure that report information is up to date. Such is the responsibility of customers. ",
  },
  {
    question: "13. Do you offer any API or integration options for businesses?",
    answer:
      "In the meantime, EquipmentGram offers no API integration options. However, EquipmentGram does have plans to have API and integration options in the future. ",
  },
  {
    question:
      "14. What payment methods are accepted for EquipmentGram's services?",
    answer: "EquipmentGram accepts credit and debit cards. ",
  },
  {
    question: "15. Is there a mobile app available for EquipmentGram?",
    answer:
      "Yes! EquipmentGram has plans for an app for the EquipmentGram account dashboard which would be available on iOS and Android devices. ",
  },
  {
    question:
      "16. Can I provide feedback or suggestions for improving EquipmentGram's service?",
    answer: "Yes! You have provide feedback and suggestions at this link. ",
  },
];

const FaqPage = (props: Props) => {
  return (
    <div className="container max-w-screen-lg mx-auto my-10 px-4">
      <Title ta="center">Frequently Asked Questions</Title>

      <div className="mt-10">
        <Accordion variant="separated">
          {faqItems.map((item) => (
            <Accordion.Item value={item.question}>
              <Accordion.Control>
                <div className="font-medium text-xl">{item.question}</div>
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
