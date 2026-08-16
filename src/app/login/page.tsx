import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign In — Admin - Hospital Dashboard",
  description: "Sign in to the Admin - Hospital Dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}
