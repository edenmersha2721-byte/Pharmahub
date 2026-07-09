import axiosInstance from "@/lib/axios/axiosInstance";

/**
 * In-app notifications (served by the notification-service behind the gateway).
 * The recipient is resolved server-side from the X-User-Id header the gateway
 * injects, so these calls take no user id.
 */

/** Bell dropdown list. Returns { page, size, totalElements, totalPages, unreadCount, notifications }. */
export async function getNotifications({ unreadOnly = false, page = 0, size = 15 } = {}) {
  const { data } = await axiosInstance.get("/notifications", {
    params: { unreadOnly, page, size },
  });
  return data;
}

/** Just the badge number. Returns { unreadCount }. */
export async function getUnreadCount() {
  const { data } = await axiosInstance.get("/notifications/unread-count");
  return data;
}

/** Mark a single notification as read. Returns the updated NotificationResponse. */
export async function markNotificationRead(id) {
  const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
  return data;
}

/** Mark all of the recipient's notifications as read. Returns { updated }. */
export async function markAllNotificationsRead() {
  const { data } = await axiosInstance.patch("/notifications/read-all");
  return data;
}
