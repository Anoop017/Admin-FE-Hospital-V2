"use client";

import { useState, useEffect } from "react";
import { KeyRound, Mail, CheckCircle2, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { forgotPassword } from "@/lib/api";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  defaultEmail = "",
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
      setError("");
      setIsSuccess(false);
      setSuccessMessage("");
    }
  }, [open, defaultEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email: email.trim() });
      setIsSuccess(true);
      setSuccessMessage(
        response?.message ||
          "If this email address is registered, a password reset link has been sent."
      );
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(
          axiosErr.response?.data?.message ||
            "Unable to process your request. Please try again."
        );
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-2">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-7" />
            </div>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Check your email
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground max-w-xs">
              {successMessage}
            </DialogDescription>

            <div className="mt-6 w-full flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full h-11"
              >
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader className="text-center sm:text-center pb-2">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <KeyRound className="size-6" />
              </div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Forgot password?
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Enter your registered admin email address and we will send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forgot-email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="admin@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 pl-10"
                    disabled={isLoading}
                  />
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full text-sm font-medium"
                >
                  {isLoading ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Sending reset link…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="h-10 w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
