import { useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import {
  LayoutDashboardIcon,
  UsersIcon,
  Building2Icon,
  ChevronDownIcon,
  BarChart3Icon,
  SettingsIcon,
  ActivityIcon,
  HeartPulseIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";

const itemBase =
  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200";
const activeItem = "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25";
const idleItem = "text-muted-foreground hover:bg-muted hover:text-foreground";

const PHARMACY_SUBS = [
  { label: "All Pharmacies", status: "ALL", to: `${PATHS.ADMIN_PHARMACIES}?status=ALL` },
  { label: "Pending Approvals", status: "PENDING", to: `${PATHS.ADMIN_PHARMACIES}?status=PENDING` },
  { label: "Approved Pharmacies", status: "APPROVED", to: `${PATHS.ADMIN_PHARMACIES}?status=APPROVED` },
];

const SOON = [
  { label: "Reports", icon: BarChart3Icon },
  { label: "Settings", icon: SettingsIcon },
  { label: "Activity Logs", icon: ActivityIcon },
];

function SectionLabel({ children }) {
  return (
    <p className="px-3.5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
      {children}
    </p>
  );
}

function QuickStat({ label, value, loading }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{loading ? "…" : value}</span>
    </div>
  );
}


export default function AdminSidebar({ stats, loading }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const onPharmacies = pathname === PATHS.ADMIN_PHARMACIES;

  const [pharmOpen, setPharmOpen] = useState(true);
  const subActive = (status) => onPharmacies && statusParam === status;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-foreground/5 bg-background/80 backdrop-blur-xl lg:flex">
      
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
          <HeartPulseIcon className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-base font-bold tracking-tight">PharmaHub</p>
          <p className="text-[11px] text-muted-foreground">Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        <NavLink to={PATHS.ADMIN_HOME} end className={({ isActive }) => cn(itemBase, isActive ? activeItem : idleItem)}>
          <LayoutDashboardIcon className="size-[18px]" />
          Dashboard
        </NavLink>

        <SectionLabel>Management</SectionLabel>
        <NavLink to={PATHS.ADMIN_USERS} className={({ isActive }) => cn(itemBase, isActive ? activeItem : idleItem)}>
          <UsersIcon className="size-[18px]" />
          Users
        </NavLink>

       
        <button
          onClick={() => setPharmOpen((o) => !o)}
          className={cn(itemBase, "justify-between", onPharmacies ? "text-foreground" : idleItem)}
        >
          <span className="flex items-center gap-3">
            <Building2Icon className="size-[18px]" />
            Pharmacies
          </span>
          <ChevronDownIcon className={cn("size-4 transition-transform", pharmOpen && "rotate-180")} />
        </button>
        {pharmOpen && (
          <div className="ml-4 flex flex-col gap-0.5 border-l border-foreground/10 pl-3">
            {PHARMACY_SUBS.map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  subActive(s.status)
                    ? "bg-indigo-500/10 text-indigo-700"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}

        <SectionLabel>System</SectionLabel>
        {SOON.map(({ label, icon: Icon }) => (
          <span key={label} className={cn(itemBase, "cursor-not-allowed text-muted-foreground/50")}>
            <Icon className="size-[18px]" />
            {label}
            <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Soon
            </span>
          </span>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mx-3 mb-2 mt-3 rounded-2xl border border-foreground/5 bg-muted/40 p-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <BarChart3Icon className="size-3.5 text-indigo-600" /> Quick Stats
        </p>
        <div className="flex flex-col gap-1.5">
          <QuickStat label="Total Users" value={stats?.totalUsers} loading={loading} />
          <QuickStat label="Total Pharmacies" value={stats?.totalPharmacies} loading={loading} />
          <QuickStat label="Pending Approvals" value={stats?.pending} loading={loading} />
          <QuickStat label="Approved Pharmacies" value={stats?.approved} loading={loading} />
        </div>
      </div>

      <button
        onClick={logout}
        className="m-3 mt-0 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOutIcon className="size-[18px]" />
        Logout
      </button>
    </aside>
  );
}
