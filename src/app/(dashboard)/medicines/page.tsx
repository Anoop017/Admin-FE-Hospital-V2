import type { Metadata } from "next";
import { MedicinesClient } from "@/components/medicines/medicines-client";

export const metadata: Metadata = {
  title: "Medicine Management — MedAdmin",
  description: "Manage pharmacy inventory.",
};

export default function MedicinesPage() {
  return <MedicinesClient />;
}
