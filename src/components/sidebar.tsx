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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/auth";
import { SidebarNavItem } from "@/components/sidebar-nav-item";
import { Separator } from "@/components/ui/separator";
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
      { label: "Users (Admin)", href: "/users", icon: Users },
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
];

export function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "sidebar-transition flex h-screen flex-col border-r border-sidebar-border bg-sidebar",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-[72px] shrink-0 items-center gap-3 px-6">
        <div className="flex size-8 shrink-0 items-center justify-center rounded bg-primary">
          <HousePlus className="size-5 text-white" />
        </div>
        {!collapsed && (
          <Link href="/dashboard" className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Admin - Hospital Dashboard
            </span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-6">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.title && !collapsed && (
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
          {/* Logout injected into the Others section basically */}
          <div className="mt-2">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-red-500 hover:bg-red-50",
                collapsed ? "justify-center" : ""
              )}
            >
              <LogOut className="size-5 shrink-0" />
              {!collapsed && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </nav>

      <Separator />

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        {collapsed ? (
          <PanelLeftOpen className="size-[18px]" />
        ) : (
          <PanelLeftClose className="size-[18px]" />
        )}
      </button>
    </aside>
  );
}
