"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, UserCheck, Lock, ShieldCheck, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers, getUsersSummary } from "@/lib/api";
import { UserTable } from "@/components/users/user-table";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import type { User, UsersSummary } from "@/types";

export function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, summaryData] = await Promise.all([
        getUsers(),
        getUsersSummary()
      ]);
      setUsers(usersData);
      setSummary(summaryData);
    } catch {
      // API error — handled by interceptor (401 redirects to login)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.roles?.some((r) => r.name.toLowerCase().includes(q))
    );
  });

  // Stats
  const totalUsers = summary?.total || 0;
  const activeUsers = summary?.active || 0;
  const lockedUsers = summary?.locked || 0;
  const adminUsers = summary?.admins || 0;

  const statCards = [
    {
      label: "Total Users",
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
      label: "Admins",
      value: adminUsers,
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
            Manage hospital employees, assign roles, and control access.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" />
          Add User
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

      {/* Search and filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="user-search"
                type="search"
                placeholder="Search users by name, email, or role…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 bg-secondary border-transparent focus:border-border"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Loading…"
                : `${filteredUsers.length} user${filteredUsers.length !== 1 ? "s" : ""} found`}
            </p>
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
