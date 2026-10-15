import { useAuthStore } from "@/features/auth/authStore";
import { withLatency } from "@/lib/api/http";
import { db } from "@/mocks/db";
import type { NotificationItem } from "./api.remote";

export const getNotifications = (): Promise<NotificationItem[]> =>
  withLatency(() =>
    db.notifications
      .filter((item) => item.recipientId === useAuthStore.getState().user?.id)
      .map(({ id, type, title, message, data, isRead, createdAt }) => ({
        id,
        type,
        title,
        message,
        data,
        isRead,
        createdAt,
      })),
  );

export const markNotificationRead = (id: string): Promise<NotificationItem> =>
  withLatency(() => {
    const item = db.notifications.find(
      (notification) =>
        notification.id === id &&
        notification.recipientId === useAuthStore.getState().user?.id,
    );
    if (!item) throw new Error("Notification not found.");
    item.isRead = true;
    return {
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      data: item.data,
      isRead: item.isRead,
      createdAt: item.createdAt,
    };
  });
