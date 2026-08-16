"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile } from "@/lib/api";
import type { AuthUser } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountPage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Account</h1>
        <p className="text-muted-foreground">Manage your account here.</p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Your Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-secondary/30">
              <Spinner className="mr-2" /> Loading profile...
            </div>
          ) : profile ? (
            <div className="space-y-4 rounded-xl bg-secondary/30 p-6">
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Name</span>
                <p className="text-base font-semibold">{profile.firstName} {profile.lastName}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <p className="text-base">{profile.email}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Mobile</span>
                <p className="text-base">{profile.mobile || "N/A"}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Roles</span>
                <div className="flex gap-2 flex-wrap">
                  {profile.roles?.map((role) => (
                    <span key={role} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {role.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl bg-secondary/30">
              <p className="text-muted-foreground">No profile data available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
