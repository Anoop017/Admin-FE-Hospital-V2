import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign In — MedAdmin",
  description: "Sign in to the MedAdmin hospital management portal.",
};

export default function LoginPage() {
  return <LoginForm />;
}
