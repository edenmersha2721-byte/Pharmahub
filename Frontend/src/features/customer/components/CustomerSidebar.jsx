import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  SearchIcon,
  FileTextIcon,
  BookmarkIcon,
  UserIcon,
  SettingsIcon,
  HeartPulseIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDisplayName } from "@/features/auth/hooks/useDisplayName";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";


const NAV = [
  { to: PATHS.CUSTOMER_HOME, label: "Home", icon: HomeIcon, end: true },
  { to: PATHS.CUSTOMER_SEARCH, label: "Search Medicine", icon: SearchIcon },
  { to: PATHS.CUSTOMER_PRESCRIPTIONS, label: "Upload Prescription", icon: FileTextIcon },
  { to: PATHS.CUSTOMER_PROFILE, label: "My Profile", icon: UserIcon, badge: "New" },
];

const SOON = [
  { label: "My Reservations", icon: BookmarkIcon },
  { label: "Settings", icon: SettingsIcon },
];

function initials(value) {
  if (!value) return "U";
  const base = value.includes("@") ? value.split("@")[0] : value.trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function NavItem({ to, label, icon: Icon, end, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="size-[18px]" />
          {label}
          {badge ? (
            <span
              className={cn(
                "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                isActive ? "bg-white/20 text-white" : "bg-indigo-500/10 text-indigo-600"
              )}
            >
              {badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

/** Fixed left sidebar for the customer area (desktop). */
export default function CustomerSidebar() {
  const { user, logout } = useAuth();
  const displayName = useDisplayName();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-foreground/5 bg-background/80 backdrop-blur-xl lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
          <HeartPulseIcon className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-base font-bold tracking-tight">PharmaHub</p>
          <p className="text-[11px] text-muted-foreground">Find medicines. Save time.</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <p className="px-3.5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Coming soon
        </p>
        {SOON.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground/50"
          >
            <Icon className="size-[18px]" />
            {label}
            <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Soon
            </span>
          </span>
        ))}
      </nav>

      <div className="mt-auto border-t border-foreground/5 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-1 py-1.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-semibold text-white">
            {initials(displayName || user?.email)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName || user?.email?.split("@")[0] || "Account"}
            </p>
            <p className="text-[11px] text-muted-foreground">Customer</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-foreground/10 bg-background px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-600"
        >
          <LogOutIcon className="size-[18px]" />
          Log out
        </button>
      </div>
    </aside>
  );
}
