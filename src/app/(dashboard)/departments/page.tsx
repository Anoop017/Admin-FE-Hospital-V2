import type { Metadata } from "next";
import { DepartmentsClient } from "@/components/departments/departments-client";

export const metadata: Metadata = {
  title: "Department Management — Admin - Hospital Dashboard",
  description: "Manage hospital departments.",
};

export default function DepartmentsPage() {
  return <DepartmentsClient />;
}
