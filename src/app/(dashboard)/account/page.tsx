"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/api";
import type { AuthUser } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, ShieldCheck, User, Mail, Phone, Shield } from "lucide-react";
import { ChangePasswordDialog } from "@/components/account/change-password-dialog";

export default function AccountPage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Account</h1>
        <p className="text-sm text-muted-foreground">Manage your profile details and security credentials.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <Card className="md:col-span-2 border border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              <CardTitle className="text-base font-bold">Profile Information</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Your registered administrative user profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
                <Spinner className="mr-2" /> Loading profile...
              </div>
            ) : profile ? (
              <div className="space-y-4 divide-y divide-border/60">
                <div className="pt-2 first:pt-0">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</span>
                  <p className="text-base font-semibold text-foreground mt-0.5">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
                <div className="pt-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="size-3.5" /> Email Address
                  </span>
                  <p className="text-sm text-foreground mt-0.5">{profile.email}</p>
                </div>
                <div className="pt-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="size-3.5" /> Contact Phone
                  </span>
                  <p className="text-sm text-foreground mt-0.5">{profile.mobile || "Not specified"}</p>
                </div>
                <div className="pt-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="size-3.5" /> Assigned Roles
                  </span>
                  <div className="flex gap-2 flex-wrap mt-1.5">
                    {profile.roles?.map((roleItem: any, idx: number) => {
                      const roleStr = typeof roleItem === "string" ? roleItem : roleItem?.name || String(roleItem);
                      return (
                        <span
                          key={idx}
                          className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize"
                        >
                          {roleStr.replace(/_/g, " ")}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
                <p>No profile data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security & Password Card */}
        <Card className="border border-border bg-card shadow-xs flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle className="text-base font-bold">Security & Access</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Manage your password and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="rounded-lg bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-2 border border-border/60">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-primary" /> Password Protection
              </p>
              <p className="leading-relaxed">
                Ensure your account is using a strong password with at least 8 characters.
              </p>
            </div>

            <Button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full gap-2 font-medium"
            >
              <KeyRound className="size-4" /> Change Password
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </div>
  );
}
