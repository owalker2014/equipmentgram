import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import { InspectionRequestObjectWithId } from "@/lib/network/inspection-requests";
import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { CancelInspectionRequest } from "@/components/CancelInspectionRequest";

type Props = {
  inspectionRequest: InspectionRequestObjectWithId;
};

const PaymentStep = ({ inspectionRequest }: Props) => {
  const { user } = useAuth();

  const pay = async () => {
    await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        userId: user?.claims.user_id,
        inspectionRequestId: inspectionRequest.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        window.location.assign(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <section className="flex items-center justify-center py-2 bg-gray">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[600px] rounded-[10px] bg-white p-10 text-center shadow-card md:py-[55px] md:px-[70px]">
            <div className="mx-auto text-center mb-14">
              <Image src="/payment.svg" alt="Payment image" width={400} height={300} style={{ width: "100%", height: "auto" }} />
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-black sm:text-3xl">Payment</h2>
            <p className="mb-5 text-base text-body-color">
              Please pay the inspection fee of $699 to continue. Once payment is complete, we will schedule your
              inspection.
            </p>
            <div className="flex flex-col">
              <CancelInspectionRequest inspectionRequest={inspectionRequest} />
              <Button onClick={pay} variant="transparent">
                Pay $699
                <IconArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentStep;
