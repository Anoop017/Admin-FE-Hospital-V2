"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/auth";

const DEMO_ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@hospital.com";
const DEMO_ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "password123";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  async function performLogin(
    targetEmail: string,
    targetPassword: string,
    isDemo: boolean = false
  ) {
    setError("");
    if (isDemo) {
      setIsDemoLoading(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await login({
        email: targetEmail,
        password: targetPassword,
      });
      const user = response.user;
      const roles = (user?.roles || []).map((r: any) =>
        typeof r === "string" ? r.toLowerCase() : r.name?.toLowerCase()
      );
      const isAdmin =
        user?.userType === "admin" ||
        roles.includes("admin") ||
        roles.includes("super_admin") ||
        roles.includes("manager");

      if (!isAdmin) {
        setError(
          "Access Denied: This dashboard is restricted to hospital administrators. Patients and clinical staff should sign in through the Patient & Staff Portal."
        );
        return;
      }

      saveSession(response);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(
          axiosErr.response?.data?.message || "Invalid email or password."
        );
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsDemoLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await performLogin(email, password, false);
  }

  async function handleDemoLogin() {
    setEmail(DEMO_ADMIN_EMAIL);
    setPassword(DEMO_ADMIN_PASSWORD);
    await performLogin(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, true);
  }

  return (
    <div className="w-full max-w-[440px] px-4 sm:px-6">
      {/* Branding */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-card border border-border shadow-sm p-3">
          <Image
            src="/admin-icon.png"
            alt="Admin Hospital Dashboard"
            width={48}
            height={48}
            className="size-11 object-contain dark:invert"
            priority
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Admin - Hospital Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Hospital Management & Administration Portal
        </p>
      </div>

      {/* Login card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        {/* One-Tap Live Demo Access */}
        <div className="mb-6 rounded-xl border border-primary/25 bg-primary/5 p-4 transition-all hover:border-primary/40">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Live Demo
              </span>
            </div>
            <span className="text-[11px] font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
              1-Tap
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Instant full-access admin preview.
          </p>
          <Button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading || isDemoLoading}
            className="w-full h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-all text-sm cursor-pointer"
          >
            {isDemoLoading ? (
              <>
                <Spinner className="size-4" />
                Entering Admin Portal…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                One-Tap Admin Login
              </>
            )}
          </Button>
        </div>

        <div className="relative mb-6 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-3 text-muted-foreground uppercase text-[10px] font-medium tracking-wider">
            Or sign in with email
          </span>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="admin@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs font-medium text-primary hover:underline transition-colors cursor-pointer"
                tabIndex={0}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={isLoading || isDemoLoading}
            className="mt-2 h-11 w-full text-sm font-medium cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn data-icon="inline-start" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Protected administrative portal. Authorized personnel only.
      </p>

      {/* Forgot Password Modal */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        defaultEmail={email}
      />
    </div>
  );
}


