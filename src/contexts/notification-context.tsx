"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { AppNotification, QueryNotificationsDto } from "@/types";
import {
  getUnreadNotificationCount,
  getNotifications,
  markNotificationAsRead as apiMarkAsRead,
  markAllNotificationsAsRead as apiMarkAllAsRead,
  deleteNotification as apiDeleteNotification,
} from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface NotificationContextValue {
  unreadCount: number;
  notifications: AppNotification[];
  isLoading: boolean;
  isFetchingList: boolean;
  filter: string;
  setFilter: (f: string) => void;
  fetchNotifications: (params?: QueryNotificationsDto) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

const POLLING_INTERVAL_MS = 30000; // 30 seconds

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingList, setIsFetchingList] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const isMountedRef = useRef(true);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const res = await getUnreadNotificationCount();
      if (isMountedRef.current) {
        setUnreadCount(res.count || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch paginated notification list
  const fetchNotifications = useCallback(
    async (params?: QueryNotificationsDto) => {
      if (!isAuthenticated()) return;
      setIsFetchingList(true);
      try {
        const queryParams: QueryNotificationsDto = {
          take: params?.take || 20,
          ...params,
        };

        if (filter === "unread") {
          queryParams.isRead = false;
        } else if (filter !== "all") {
          queryParams.type = filter;
        }

        const res = await getNotifications(queryParams);
        if (isMountedRef.current) {
          setNotifications(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        if (isMountedRef.current) {
          setIsFetchingList(false);
        }
      }
    },
    [filter]
  );

  // Optimistic Mark Single as Read
  const markAsRead = useCallback(
    async (id: number) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await apiMarkAsRead(id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    },
    []
  );

  // Optimistic Mark All as Read
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await apiMarkAllAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }, []);

  // Optimistic Delete/Dismiss
  const removeNotification = useCallback(
    async (id: number) => {
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      try {
        await apiDeleteNotification(id);
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }
    },
    [notifications]
  );

  // Initial load + periodic polling + window focus handler
  useEffect(() => {
    isMountedRef.current = true;
    refreshUnreadCount();

    const interval = setInterval(() => {
      refreshUnreadCount();
    }, POLLING_INTERVAL_MS);

    const onFocus = () => {
      refreshUnreadCount();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshUnreadCount]);

  // When filter changes, re-fetch notifications if already loaded
  useEffect(() => {
    fetchNotifications();
  }, [filter, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        isLoading,
        isFetchingList,
        filter,
        setFilter,
        fetchNotifications,
        refreshUnreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
