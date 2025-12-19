import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  rem,
  Button,
} from "@mantine/core";
import {
  IconGauge,
  IconCookie,
  IconUser,
  IconMessage2,
  IconLock,
} from "@tabler/icons-react";
import Link from "next/link";

export const MOCKDATA = [
  {
    icon: IconGauge,
    title: "Transparency",
    description:
      "Empowers buyers with information and trust to make informed and confident purchasing decisions possible",
  },
  {
    icon: IconGauge,
    title: "Quality Assurance",
    description:
      "Ensures that the equipment being bought and sold is in good condition, as it directly impacts the buyers/sellers' experience and long-term satisfaction",
  },
  {
    icon: IconGauge,
    title: "Risk Mitigation",
    description:
      "Reduced risk means buyers/sellers are less likely to face unexpected expenses or downtime due to equipment issues",
  },
  {
    icon: IconGauge,
    title: "Insurance Benefits",
    description:
      "Some insurance companies may offer better rates for equipment with documented inspection reports",
  },
  {
    icon: IconGauge,
    title: "Standardization",
    description:
      "Providing standardized inspection reports simplifies the buying/selling process and enhances the efficiency of the marketplace",
  },
  {
    icon: IconGauge,
    title: "Credibility",
    description:
      "The involvement of professional inspectors instills confidence in the accuracy of the inspection reports, making the service more trustworthy",
  },
  {
    icon: IconGauge,
    title: "Peace of Mind",
    description:
      "Offering buyers/sellers peace of mind is a valuable benefit, as it reduces stress and anxiety associated with significant purchases",
  },
  {
    icon: IconGauge,
    title: "Market Efficiency",
    description:
      "Streamlining the buying and selling process in the construction equipment market benefits all parties involved and enhances overall market efficiency",
  },
  {
    icon: IconGauge,
    title: "Improved Resale Value",
    description:
      "For sellers, having an EquipmentGram inspection report can help justify a higher resale price",
  },
  {
    icon: IconGauge,
    title: "Reduced Fraud",
    description:
      "Helps reduce the likelihood of fraud and misrepresentation of equipment condition",
  },
  {
    icon: IconGauge,
    title: "Regulatory Compliance",
    description:
      "Ensures that equipment meets all necessary regulatory and safety standards",
  },
  {
    icon: IconGauge,
    title: "Long-Term Reliability",
    description:
      "Buyers can expect better long-term reliability and durability from equipment with documented inspections",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

interface FeaturesGridProps {
  indices?: number[];
  cpr?: number;
  isLanding?: boolean;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="bg-white p-5">
      {/* <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ThemeIcon> */}
      <Text mb={5} className="font-bold text-blue-700">
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export function FeaturesGrid({
  indices,
  cpr = 4,
  isLanding,
}: FeaturesGridProps) {
  const selectedFeatures = indices?.map((index) => MOCKDATA[index]) ?? MOCKDATA;
  const features = selectedFeatures.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL!;

  return (
    <div className="bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
        <Title className="text-center">EquipmentGram's Benefits</Title>

        <Text size="sm" className="text-center">
          Below are some benefits that come with using EquipmentGram reports
        </Text>

        <SimpleGrid
          mt={30}
          cols={{ base: 1, sm: 2, md: cpr }}
          spacing={{ base: "xl", md: 30 }}
          verticalSpacing={{ base: "xl", md: 30 }}
        >
          {features}
        </SimpleGrid>

        {!isLanding && (
          <div className="mt-10">
            <p className="mb-2">
              Join us on this journey to bring transparency, trust, and
              reliability to the construction equipment marketplace.&nbsp;
              <Link href="/contact-us" className="font-bold text-blue-700">
                Ready to get started? Contact us today!
              </Link>
            </p>
          </div>
        )}

        {isLanding && (
          <div className="mt-5 flex flex-row justify-end">
            <Link href="/pricing">
              <Button fullWidth size="md" className="rounded-s-full">
                Check pricing
              </Button>
            </Link>
            <Link href={dashboardUrl}>
              <Button
                fullWidth
                size="md"
                className="text-blue-700 rounded-e-full bg-white hover:bg-blue-100"
              >
                Produce a report &nbsp;&#x2192;
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
