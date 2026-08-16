import type { Metadata } from "next";
import { BillingClient } from "@/components/billing/billing-client";

export const metadata: Metadata = {
  title: "Billing Management — Admin - Hospital Dashboard",
  description: "Manage bills and payments.",
};

export default function BillingPage() {
  return <BillingClient />;
}
