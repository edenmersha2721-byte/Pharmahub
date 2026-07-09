import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "@/features/notifications/api/notificationApi";

const POLL_MS = 45_000;

/**
 * Drives the notification bell: keeps the unread badge fresh by polling, and
 * lazily loads the dropdown list when it's opened.
 */
export function useNotifications() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  const refreshCount = useCallback(async () => {
    try {
      const { unreadCount } = await api.getUnreadCount();
      if (mounted.current) setUnreadCount(unreadCount ?? 0);
    } catch {
      /* silent — the bell just keeps its last known count */
    }
  }, []);

  // Poll the unread count. The fetch runs in a nested async function so no
  // state is set synchronously in the effect body.
  useEffect(() => {
    mounted.current = true;
    async function poll() {
      try {
        const { unreadCount } = await api.getUnreadCount();
        if (mounted.current) setUnreadCount(unreadCount ?? 0);
      } catch {
        /* keep last known count */
      }
    }
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications({ page: 0, size: 15 });
      if (!mounted.current) return;
      setItems(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
      setLoaded(true);
    } catch {
      if (mounted.current) setItems([]);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id) => {
    // Optimistic: flip locally, then persist.
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await api.markNotificationRead(id);
    } catch {
      refreshCount();
    }
  }, [refreshCount]);

  const markAllRead = useCallback(async () => {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await api.markAllNotificationsRead();
    } catch {
      refreshCount();
    }
  }, [refreshCount]);

  return { items, unreadCount, loading, loaded, loadList, markRead, markAllRead };
}

export default useNotifications;
