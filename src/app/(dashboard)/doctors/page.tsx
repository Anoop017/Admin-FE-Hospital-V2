import type { Metadata } from "next";
import { DoctorsClient } from "@/components/doctors/doctors-client";

export const metadata: Metadata = {
  title: "Doctor Management — MedAdmin",
  description: "Manage doctors and specialists.",
};

export default function DoctorsPage() {
  return <DoctorsClient />;
}
