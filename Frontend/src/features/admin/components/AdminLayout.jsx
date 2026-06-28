import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  ShieldCheckIcon,
  LayoutDashboardIcon,
  Building2Icon,
  UsersIcon,
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";
import * as adminApi from "@/features/admin/api/adminApi";
import AdminSidebar from "@/features/admin/components/AdminSidebar";

const MOBILE_NAV = [
  { to: PATHS.ADMIN_HOME, label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: `${PATHS.ADMIN_PHARMACIES}?status=PENDING`, label: "Pharmacies", icon: Building2Icon },
  { to: PATHS.ADMIN_USERS, label: "Users", icon: UsersIcon },
];

function AvatarMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 py-1 pl-1 pr-2 transition-all hover:border-foreground/20 hover:shadow-sm"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <ShieldCheckIcon className="size-4" />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-xs font-semibold text-foreground">Admin User</span>
          <span className="block text-[11px] text-muted-foreground">Administrator</span>
        </span>
        <ChevronDownIcon className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 shadow-xl shadow-foreground/5 backdrop-blur-xl duration-150 animate-in fade-in-0 zoom-in-95">
            <div className="border-b border-foreground/5 p-3">
              <p className="text-xs font-medium text-muted-foreground">Administrator</p>
              <p className="truncate text-sm font-medium text-foreground">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LogOutIcon className="size-4 text-muted-foreground" />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const EMPTY_STATS = { totalUsers: 0, totalPharmacies: 0, pending: 0, approved: 0 };


export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [stats, setStats] = useState(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsKey, setStatsKey] = useState(0);
  const refreshStats = useCallback(() => setStatsKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    async function loadStats() {
      setStatsLoading(true);
      try {
        const [pending, approved, all, users] = await Promise.all([
          adminApi.getPharmacies({ status: "PENDING", page: 0, size: 1 }),
          adminApi.getPharmacies({ status: "APPROVED", page: 0, size: 1 }),
          adminApi.getPharmacies({ page: 0, size: 1 }),
          adminApi.getUsers({ page: 0, size: 1 }),
        ]);
        if (!active) return;
        setStats({
          pending: pending.totalElements ?? 0,
          approved: approved.totalElements ?? 0,
          totalPharmacies: all.totalElements ?? 0,
          totalUsers: users.totalElements ?? 0,
        });
      } catch {
        if (active) setStats(EMPTY_STATS);
      } finally {
        if (active) setStatsLoading(false);
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, [statsKey]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <AdminSidebar stats={stats} loading={statsLoading} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-foreground/5 bg-background/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <span className="flex items-center gap-2 lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <ShieldCheckIcon className="size-4" />
              </span>
              <span className="font-heading text-sm font-semibold">Admin</span>
            </span>
            <div className="hidden lg:block" />

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => toast("You're all caught up — no new alerts.")}
                className="relative flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifications"
              >
                <BellIcon className="size-[18px]" />
                {stats.pending > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                    {stats.pending > 9 ? "9+" : stats.pending}
                  </span>
                )}
              </button>
              <AvatarMenu user={user} onLogout={logout} />
            </div>
          </div>

          <nav className="flex items-center gap-1 border-t border-foreground/5 px-3 py-2 lg:hidden">
            {MOBILE_NAV.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "text-muted-foreground"
                  )
                }
              >
                <link.icon className="size-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main
          key={location.pathname}
          className="mx-auto w-full max-w-6xl px-4 py-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2 sm:px-6 sm:py-8"
        >
          <Outlet context={{ stats, statsLoading, refreshStats }} />
        </main>
      </div>
    </div>
  );
}
