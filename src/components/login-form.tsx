"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, HousePlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });
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
    }
  }

  return (
    <div className="w-full max-w-[420px] px-6">
      {/* Branding */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
          <HousePlus className="size-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Admin - Hospital Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>

      {/* Login card */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your admin account
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            disabled={isLoading}
            className="mt-1 h-11 w-full text-sm font-medium"
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
        Protected area. Authorized personnel only.
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

