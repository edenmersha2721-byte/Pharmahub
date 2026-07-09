import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { notificationMeta } from "@/features/notifications/notificationMeta";
import { timeAgo } from "@/lib/helpers/helpers";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { items, unreadCount, loading, loaded, loadList, markRead, markAllRead } = useNotifications();

  // Load the list the first time the dropdown opens (and refresh on each open).
  useEffect(() => {
    if (open) loadList();
  }, [open, loadList]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleItemClick = (n) => {
    if (!n.read) markRead(n.id);
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
      >
        <BellIcon className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold leading-4 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 shadow-xl shadow-foreground/5 backdrop-blur-xl duration-150 animate-in fade-in-0 zoom-in-95 sm:w-96">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-foreground/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="font-heading text-sm font-semibold">Notifications</p>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  <CheckCheckIcon className="size-3.5" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {loading && !loaded && (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">Loading…</p>
              )}
              {loaded && items.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <BellIcon className="size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">You're all caught up.</p>
                </div>
              )}
              {items.map((n) => {
                const { icon: Icon, tone } = notificationMeta(n.type);
                return (
                  <button
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60",
                      !n.read && "bg-indigo-500/[0.04]"
                    )}
                  >
                    <span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl", tone)}>
                      <Icon className="size-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <span className="truncate">{n.title}</span>
                        {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-indigo-600" />}
                      </p>
                      {n.message && (
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {n.message}
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-muted-foreground/70">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
