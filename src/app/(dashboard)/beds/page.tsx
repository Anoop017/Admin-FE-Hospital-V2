import type { Metadata } from "next";
import { BedsClient } from "@/components/beds/beds-client";

export const metadata: Metadata = {
  title: "Bed Management — Admin - Hospital Dashboard",
  description: "Manage hospital beds.",
};

export default function BedsPage() {
  return <BedsClient />;
}
