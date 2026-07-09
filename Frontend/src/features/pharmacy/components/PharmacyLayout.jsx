import { NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  PillIcon,
  LayoutDashboardIcon,
  BoxesIcon,
  PlusIcon,
  MapPinIcon,
  ChevronDownIcon,
} from "lucide-react";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";
import PharmacySidebar from "@/features/pharmacy/components/PharmacySidebar";
import OpenStatusToggle from "@/features/pharmacy/components/OpenStatusToggle";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const MOBILE_NAV = [
  { to: PATHS.PHARMACY_HOME, label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: PATHS.PHARMACY_INVENTORY, label: "Medicines", icon: BoxesIcon },
  { to: `${PATHS.PHARMACY_INVENTORY}?add=1`, label: "Add", icon: PlusIcon },
];

/** Pharmacy shell: fixed sidebar + sticky top bar + routed content. */
export default function PharmacyLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <PharmacySidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-foreground/5 bg-background/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white lg:hidden">
                <PillIcon className="size-4" />
              </span>
              <button
                onClick={() => toast("Pharmacy location is set from your registration.")}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
              >
                <MapPinIcon className="size-4 text-indigo-600" />
                <span className="max-w-[12rem] truncate">My Pharmacy</span>
                <ChevronDownIcon className="size-3.5 opacity-60" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <OpenStatusToggle />
              <NotificationBell />
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
