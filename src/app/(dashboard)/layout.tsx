"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { isAuthenticated } from "@/lib/auth";
import { NotificationProvider } from "@/contexts/notification-context";
import { MobileNavProvider } from "@/contexts/mobile-nav-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      // Restore theme preference
      const saved = localStorage.getItem("medadmin_theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <MobileNavProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            <Topbar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-3.5 sm:p-5 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </MobileNavProvider>
    </NotificationProvider>
  );
}

