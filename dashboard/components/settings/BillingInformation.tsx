"use client";

import { useAuth } from "@/lib/authContext";
import { notify } from "@/lib/utils";
import { Skeleton, Title } from "@mantine/core";
import { IconChevronRight, IconCreditCard } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

type PaymentMethod = {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
};

export const BillingInformation: React.FC = () => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    fetch(`/api/payment-methods?userId=${user.uid}`)
      .then((r) => r.json())
      .then((data) => setPaymentMethod(data.paymentMethod))
      .catch(() => setPaymentMethod(null))
      .finally(() => setFetching(false));
  }, [user?.uid]);

  const handleBillingPortal = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      if (!res.ok) throw new Error("Failed to open billing portal");
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      notify(
        {
          title: "Error",
          message: e instanceof Error ? e.message : "Unknown error",
        },
        true,
      );
      setLoading(false);
    }
  };

  const brandLabel = paymentMethod
    ? paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)
    : "";

  return (
    <>
      <Title size={20}>Billing Information</Title>
      <div className="flex flex-col rounded mt-2 mb-7 gap-3">
        {fetching ? (
          <Skeleton height={52} radius="sm" />
        ) : paymentMethod ? (
          <div className="flex gap-3 text-gray-500 rounded border border-slate-300 p-3 cursor-pointer">
            <IconCreditCard size={28} className="text-blue-700 mt-1 shrink-0" />
            <span className="flex-grow font-semibold pt-1">
              {brandLabel} •••• {paymentMethod.last4}
            </span>
            <span className="pt-1 text-sm">
              {String(paymentMethod.exp_month).padStart(2, "0")}/
              {String(paymentMethod.exp_year).slice(-2)}
            </span>
            <span className="pt-1">
              <IconChevronRight />
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 border border-dashed border-slate-300 rounded p-3">
            No payment method added yet.
          </p>
        )}

        <button
          onClick={handleBillingPortal}
          disabled={loading || fetching}
          className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Redirecting..."
            : paymentMethod
              ? "Update Payment Method"
              : "Add Payment Method"}
        </button>
      </div>
    </>
  );
};

export default BillingInformation;
