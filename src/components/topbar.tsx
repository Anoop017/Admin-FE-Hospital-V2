"use client";

import { useRouter } from "next/navigation";
import { Sun, Moon, Menu } from "lucide-react";
import { useState, useEffect } from "react";
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
import { useMobileNav } from "@/contexts/mobile-nav-context";
import { ChangePasswordDialog } from "@/components/account/change-password-dialog";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

export function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { toggleMobileNav } = useMobileNav();

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
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-3.5 sm:px-6">
        {/* Left side: Mobile Menu Trigger + Brand hint */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileNav}
            className="md:hidden size-9 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="size-9 text-muted-foreground hover:text-foreground cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="flex items-center gap-2.5 rounded-lg p-1 sm:px-2 sm:py-1.5 transition-colors hover:bg-secondary cursor-pointer"
                  aria-label="User account menu"
                />
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
