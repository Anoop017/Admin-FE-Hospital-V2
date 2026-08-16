import type { Metadata } from "next";
import { UsersClient } from "@/components/users/users-client";

export const metadata: Metadata = {
  title: "User Management — Admin - Hospital Dashboard",
  description: "Manage hospital employees, assign roles, and control access.",
};

export default function UsersPage() {
  return <UsersClient />;
}
