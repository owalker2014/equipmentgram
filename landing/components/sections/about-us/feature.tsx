import { Text, Title, SimpleGrid, Button } from "@mantine/core";
import { IconGauge } from "@tabler/icons-react";
import Link from "next/link";

export const MOCKDATA = [
  {
    icon: IconGauge,
    title: "Transparency",
    description:
      "Gives buyers and sellers clear visibility into excavator condition for more confident decisions.",
  },
  {
    icon: IconGauge,
    title: "Quality Assurance",
    description:
      "Helps verify the condition of excavators at the point of sale or transfer.",
  },
  {
    icon: IconGauge,
    title: "Risk Mitigation",
    description:
      "Reduces unexpected repair costs and downtime by identifying issues early.",
  },
  {
    icon: IconGauge,
    title: "Insurance & Financing Support",
    description:
      "Documented inspection reports may support better insurance or financing terms.",
  },
  {
    icon: IconGauge,
    title: "Standardization",
    description:
      "Standardized excavator reports simplify comparison and speed up transactions.",
  },
  {
    icon: IconGauge,
    title: "Credibility",
    description:
      "Consistent, structured reports improve trust in shared condition data.",
  },
  {
    icon: IconGauge,
    title: "Peace of Mind",
    description:
      "Reduces uncertainty and stress around high-value excavator purchases.",
  },
  {
    icon: IconGauge,
    title: "Market Efficiency",
    description:
      "Faster, clearer information flow improves excavator buying and selling outcomes.",
  },
  {
    icon: IconGauge,
    title: "Improved Resale Value",
    description:
      "Well-documented excavators are easier to price and justify at resale.",
  },
  {
    icon: IconGauge,
    title: "Reduced Fraud",
    description:
      "Clear documentation helps limit misrepresentation of excavator condition.",
  },
  {
    icon: IconGauge,
    title: "Compliance Readiness",
    description:
      "Supports documentation needed for safety, regulatory, or internal requirements.",
  },
  {
    icon: IconGauge,
    title: "Long-Term Reliability",
    description:
      "Better condition tracking supports stronger long-term ownership outcomes.",
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

        <Text size="sm" className="text-center text-gray-600">
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
              reliability to the excavator marketplace.&nbsp;
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
                Check Pricing
              </Button>
            </Link>
            <Link href={dashboardUrl}>
              <Button
                fullWidth
                size="md"
                className="text-blue-700 rounded-e-full bg-white hover:bg-blue-100"
              >
                Produce a Report &nbsp;&#x2192;
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
