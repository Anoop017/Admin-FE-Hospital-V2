import type { Metadata } from "next";
import { LaboratoryClient } from "@/components/laboratory/laboratory-client";

export const metadata: Metadata = {
  title: "Laboratory — Admin - Hospital Dashboard",
  description: "Manage lab tests.",
};

export default function LaboratoryPage() {
  return <LaboratoryClient />;
}
