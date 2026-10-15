import { http } from "@/lib/api/http";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = () =>
  http.get<NotificationItem[]>("/notifications");

export const markNotificationRead = (id: string) =>
  http.post<NotificationItem>(`/notifications/${id}/read`);
