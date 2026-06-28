import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboardIcon,
  BoxesIcon,
  PlusIcon,
  ClipboardListIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  UserIcon,
  SettingsIcon,
  PillIcon,
  CrownIcon,
} from "lucide-react";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { to: PATHS.PHARMACY_HOME, label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: PATHS.PHARMACY_INVENTORY, label: "All Medicines", icon: BoxesIcon },
  { to: `${PATHS.PHARMACY_INVENTORY}?add=1`, label: "Add Medicine", icon: PlusIcon },
];

const SOON = [
  { label: "Reservations", icon: ClipboardListIcon },
  { label: "Orders", icon: ShoppingCartIcon },
  { label: "Reports", icon: BarChart3Icon },
  { label: "Profile", icon: UserIcon },
  { label: "Settings", icon: SettingsIcon },
];

/** Fixed left sidebar for the pharmacy area (desktop). */
export default function PharmacySidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-foreground/5 bg-background/80 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
          <PillIcon className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-base font-bold tracking-tight">PharmaHub</p>
          <p className="text-[11px] text-muted-foreground">Pharmacy Dashboard</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
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
            <Icon className="size-[18px]" />
            {label}
          </NavLink>
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

      <div className="m-3 rounded-2xl border border-foreground/5 bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
        <CrownIcon className="size-6" />
        <p className="mt-2 text-sm font-semibold">Upgrade to Premium</p>
        <p className="mt-0.5 text-xs text-white/80">Advanced insights, priority support &amp; more.</p>
        <button
          onClick={() => toast.success("Premium is on the way — we'll let you know!")}
          className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-sm font-semibold text-indigo-700 transition-transform hover:-translate-y-0.5"
        >
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
