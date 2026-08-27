"use client";

import { useRouter } from "next/navigation";
import { Bell, Mail, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { clearSession, getUser } from "@/lib/auth";
import type { AuthUser } from "@/types";

import { ChangePasswordDialog } from "@/components/account/change-password-dialog";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

export function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    // Check initial theme
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("medadmin_theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("medadmin_theme", "dark");
    }
    setIsDark(!isDark);
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const initials = user?.email?.charAt(0).toUpperCase() || "A";

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
        {/* Left side brand / spacer */}
        <div className="flex items-center gap-2">
          {/* Topbar left area */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-6">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Mail */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Mail className="size-[18px]" />
          </Button>


          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="ml-2 flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary" />
              }
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {user?.email || "Admin"}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="status-dot status-dot--active" />
                  Online
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/account")}>
                Account Overview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)}>
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </>
  );
}
