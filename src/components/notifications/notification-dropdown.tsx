"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  Calendar,
  BedDouble,
  DollarSign,
  FlaskConical,
  Pill,
  ShieldAlert,
  Info,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/contexts/notification-context";
import type { AppNotification } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function getNotificationIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "appointment":
      return {
        icon: Calendar,
        bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
        border: "border-teal-500/20",
      };
    case "admission":
      return {
        icon: BedDouble,
        bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20",
      };
    case "billing":
      return {
        icon: DollarSign,
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20",
      };
    case "lab":
      return {
        icon: FlaskConical,
        bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/20",
      };
    case "prescription":
      return {
        icon: Pill,
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
      };
    case "urgent":
    case "system":
    default:
      return {
        icon: ShieldAlert,
        bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
      };
  }
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "appointment", label: "Appointments" },
  { id: "billing", label: "Billing" },
  { id: "admission", label: "Admissions" },
  { id: "lab", label: "Lab" },
  { id: "prescription", label: "Rx" },
];

export function NotificationDropdown() {
  const router = useRouter();
  const {
    unreadCount,
    notifications,
    isFetchingList,
    filter,
    setFilter,
    fetchNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
      refreshUnreadCount();
    }
    setIsOpen(!isOpen);
  };

  const handleItemClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="fixed inset-x-3.5 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 max-w-[calc(100vw-1.75rem)] rounded-xl border border-border bg-card text-card-foreground shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] px-1.5 py-0"
                >
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  fetchNotifications();
                  refreshUnreadCount();
                }}
                disabled={isFetchingList}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                title="Refresh notifications"
              >
                <RotateCw
                  className={`size-3.5 ${isFetchingList ? "animate-spin" : ""}`}
                />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                  title="Mark all as read"
                >
                  <CheckCheck className="size-3.5 text-primary" />
                  <span className="hidden sm:inline">Mark all read</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 border-b border-border/60 bg-muted/10 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filter === cat.id
                    ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
            {isFetchingList && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <RotateCw className="size-6 animate-spin text-primary mb-2" />
                <p className="text-xs">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted mb-2.5">
                  <Bell className="size-5 opacity-40" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  All caught up!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">
                  No {filter !== "all" ? `${filter} ` : ""}notifications to
                  display right now.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const config = getNotificationIcon(item.type);
                const IconComponent = config.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                      item.isRead
                        ? "hover:bg-muted/30"
                        : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${config.bg} ${config.border} mt-0.5`}
                    >
                      <IconComponent className="size-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <p
                          className={`text-xs leading-tight truncate ${
                            item.isRead
                              ? "text-foreground font-medium"
                              : "text-foreground font-semibold"
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Metadata row: Priority badge + link hint */}
                      <div className="flex items-center gap-2 pt-0.5">
                        {item.priority === "urgent" && (
                          <Badge
                            variant="destructive"
                            className="text-[9px] px-1 py-0 h-4 uppercase font-bold"
                          >
                            Urgent
                          </Badge>
                        )}
                        {item.priority === "warning" && (
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1 py-0 h-4 uppercase font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          >
                            Warning
                          </Badge>
                        )}
                        {item.link && (
                          <span className="flex items-center gap-0.5 text-[10px] text-primary/80 font-medium group-hover:underline">
                            View details <ExternalLink className="size-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unread indicator dot */}
                    {!item.isRead && (
                      <span className="size-2 shrink-0 rounded-full bg-primary mt-1.5" />
                    )}

                    {/* Quick action buttons on hover */}
                    <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-card/95 backdrop-blur-xs p-0.5 rounded-md border border-border shadow-xs">
                      {!item.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(item.id);
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Mark as read"
                        >
                          <Check className="size-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(item.id);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Dismiss notification"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/80 px-4 py-2 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live In-App Alerts
            </span>
            <span>Real-time polling</span>
          </div>
        </div>
      )}
    </div>
  );
}
