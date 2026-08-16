import type { Metadata } from "next";
import { PrescriptionsClient } from "@/components/prescriptions/prescriptions-client";

export const metadata: Metadata = {
  title: "Prescriptions — MedAdmin",
  description: "Manage patient prescriptions.",
};

export default function PrescriptionsPage() {
  return <PrescriptionsClient />;
}
