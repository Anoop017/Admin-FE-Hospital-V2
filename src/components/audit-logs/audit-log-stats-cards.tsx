"use client";

import { FileText, CheckCircle2, Ban, Clock3, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogStats } from "@/types";

interface AuditLogStatsCardsProps {
  stats: AuditLogStats | null;
  loading: boolean;
}

export function AuditLogStatsCards({ stats, loading }: AuditLogStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border border-border bg-card shadow-xs">
            <CardContent className="flex items-center gap-3.5 p-4.5">
              <Skeleton className="size-11 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const total = stats?.total ?? 0;
  const successCount = stats?.successCount ?? 0;
  const successPct = stats?.successPercentage ?? (total > 0 ? ((successCount / total) * 100) : 0);

  const failureCount = stats?.failureCount ?? 0;
  const failurePct = stats?.failurePercentage ?? (total > 0 ? ((failureCount / total) * 100) : 0);

  const inProgressCount = stats?.inProgressCount ?? 0;
  const inProgressPct = stats?.inProgressPercentage ?? (total > 0 ? ((inProgressCount / total) * 100) : 0);

  const avgDuration = stats?.averageDuration ?? 0;

  const cards = [
    {
      title: "Total Events",
      value: total.toLocaleString(),
      subtext: "All time",
      icon: FileText,
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Successful",
      value: successCount.toLocaleString(),
      subtext: `${Number(successPct).toFixed(1)}%`,
      icon: CheckCircle2,
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Failed",
      value: failureCount.toLocaleString(),
      subtext: `${Number(failurePct).toFixed(1)}%`,
      icon: Ban,
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "In Progress",
      value: inProgressCount.toLocaleString(),
      subtext: `${Number(inProgressPct).toFixed(1)}%`,
      icon: Clock3,
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Average Duration",
      value: `${avgDuration}ms`,
      subtext: "Average latency",
      icon: Gauge,
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="border border-border/80 bg-card shadow-xs transition-all duration-200 hover:shadow-sm"
          >
            <CardContent className="flex items-center gap-3.5 p-4.5">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {card.title}
                </p>
                <p className="text-xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground truncate">
                  {card.subtext}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
