import type { Metadata } from "next";
import { WardsClient } from "@/components/wards/wards-client";

export const metadata: Metadata = {
  title: "Ward Management — Admin - Hospital Dashboard",
  description: "Manage hospital wards.",
};

export default function WardsPage() {
  return <WardsClient />;
}
