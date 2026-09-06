"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, UserCheck, Lock, ShieldCheck, Search, Shield, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers, getUsersSummary, getAdmins } from "@/lib/api";
import { UserTable } from "@/components/users/user-table";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import type { User, UsersSummary, AdminUser } from "@/types";

export function UsersClient() {
  const [portalUsers, setPortalUsers] = useState<User[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<User[]>([]);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "staff" | "admins">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, summaryData, adminsData] = await Promise.all([
        getUsers(),
        getUsersSummary(),
        getAdmins().catch(() => [] as AdminUser[])
      ]);

      const formattedAdmins: User[] = adminsData.map((a) => ({
        id: a.id,
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        mobile: a.mobile || "",
        isActive: a.isActive,
        isLocked: a.isLocked,
        createdAt: a.createdAt,
        roles: [{ name: a.role || "admin" }],
        isSystemAdmin: true,
      }));

      setPortalUsers(usersData);
      setAdminUsersList(formattedAdmins);
      setSummary(summaryData);
    } catch {
      // API error - handled by interceptor (401 redirects to login)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Combine or filter by tab
  const displayedUsers = selectedTab === "admins"
    ? adminUsersList
    : selectedTab === "staff"
    ? portalUsers
    : [...adminUsersList, ...portalUsers];

  const filteredUsers = displayedUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.roles?.some((r) => r.name.toLowerCase().includes(q))
    );
  });

  // Stats
  const totalUsers = (summary?.total || 0) + adminUsersList.length;
  const activeUsers = (summary?.active || 0) + adminUsersList.filter((a) => a.isActive).length;
  const lockedUsers = (summary?.locked || 0) + adminUsersList.filter((a) => a.isLocked).length;
  const adminUsersCount = adminUsersList.length || summary?.admins || 0;

  const statCards = [
    {
      label: "Total Accounts",
      value: totalUsers,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: activeUsers,
      icon: UserCheck,
      iconBg: "bg-[#059669]/10",
      iconColor: "text-[#059669]",
    },
    {
      label: "Locked",
      value: lockedUsers,
      icon: Lock,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    {
      label: "Administrators",
      value: adminUsersCount,
      icon: ShieldCheck,
      iconBg: "bg-[#6366F1]/10",
      iconColor: "text-[#6366F1]",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage hospital staff, system administrators, assign roles, and control access.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" />
          Add Account
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border border-border bg-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="mb-1.5 h-7 w-10" />
                      <Skeleton className="h-3.5 w-16" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold tracking-tight text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search, Tabs, and Filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/80 w-fit">
              <button
                type="button"
                onClick={() => setSelectedTab("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedTab === "all"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Accounts ({totalUsers})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("admins")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedTab === "admins"
                    ? "bg-card text-[#6366F1] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="size-3.5" />
                Administrators ({adminUsersList.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("staff")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedTab === "staff"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Stethoscope className="size-3.5" />
                Hospital Staff & Patients ({portalUsers.length})
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user-search"
                  type="search"
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 bg-secondary border-transparent focus:border-border text-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {loading
                  ? "Loading..."
                  : `${filteredUsers.length} user${filteredUsers.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User table */}
      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col gap-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={(user) => setEditUser(user)}
              onDelete={(user) => setDeleteUser(user)}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchUsers}
      />

      {editUser && (
        <EditUserDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => {
            if (!open) setEditUser(null);
          }}
          onSuccess={fetchUsers}
        />
      )}

      {deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          open={!!deleteUser}
          onOpenChange={(open) => {
            if (!open) setDeleteUser(null);
          }}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
