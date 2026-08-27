"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Users,
  Stethoscope,
  UserRound,
  UserCog,
  CalendarCheck,
  BedDouble,
  Building2,
  FileText,
  CreditCard,
  Mail,
  Box,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  HousePlus,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/auth";
import { SidebarNavItem } from "@/components/sidebar-nav-item";
import { Separator } from "@/components/ui/separator";
import { useMobileNav } from "@/contexts/mobile-nav-context";
import { Button } from "@/components/ui/button";
import type { NavSection } from "@/types";

const navSections: NavSection[] = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Your Account", href: "/account", icon: UserRound },
    ],
  },
  {
    title: "PEOPLE & HR",
    items: [
      { label: "Patients", href: "/patients", icon: Users },
      { label: "Doctors", href: "/doctors", icon: Stethoscope },
      { label: "Staff", href: "/staff", icon: UserCog },
      { label: "Departments", href: "/departments", icon: Building2 },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Appointments", href: "/appointments", icon: CalendarCheck },
      { label: "Admissions", href: "/admissions", icon: Activity },
      { label: "Wards", href: "/wards", icon: BedDouble },
      { label: "Beds", href: "/beds", icon: BedDouble },
    ],
  },
  {
    title: "CLINICAL & PHARMACY",
    items: [
      { label: "Medical Records", href: "/medical-records", icon: FileText },
      { label: "Prescriptions", href: "/prescriptions", icon: FileText },
      { label: "Medicines", href: "/medicines", icon: Box },
      { label: "Laboratory", href: "/laboratory", icon: Activity },
    ],
  },
  {
    title: "FINANCIAL",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Audit Logs", href: "/audit-logs", icon: ShieldCheck },
    ],
  },
];

export function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, closeMobileNav } = useMobileNav();

  function handleLogout() {
    clearSession();
    closeMobileNav();
    router.push("/login");
  }

  const navContent = (isMobile: boolean = false) => (
    <div className="flex h-full flex-col">
      {/* Header / Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded bg-primary">
            <HousePlus className="size-5 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <Link
              href="/dashboard"
              onClick={() => isMobile && closeMobileNav()}
              className="flex flex-col"
            >
              <span className="text-lg font-bold tracking-tight text-foreground">
                Admin Dashboard
              </span>
            </Link>
          )}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileNav}
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-6">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.title && (!collapsed || isMobile) && (
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    collapsed={!isMobile && collapsed}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Logout button */}
          <div className="mt-2">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
                !isMobile && collapsed ? "justify-center" : ""
              )}
            >
              <LogOut className="size-5 shrink-0" />
              {(isMobile || !collapsed) && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Collapse toggle (Desktop only) */}
      {!isMobile && (
        <>
          <Separator />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-[18px]" />
            ) : (
              <PanelLeftClose className="size-[18px]" />
            )}
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Permanent Sidebar (md+) ── */}
      <aside
        className={cn(
          "sidebar-transition hidden md:flex h-screen flex-col border-r border-sidebar-border bg-sidebar shrink-0",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {navContent(false)}
      </aside>

      {/* ── Mobile Slide-out Drawer (<md) ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={closeMobileNav}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-left"
          >
            {navContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
