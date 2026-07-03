import { NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  HeartPulseIcon,
  HomeIcon,
  SearchIcon,
  FileTextIcon,
  BellIcon,
} from "lucide-react";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";
import CustomerSidebar from "@/features/customer/components/CustomerSidebar";

const MOBILE_NAV = [
  { to: PATHS.CUSTOMER_HOME, label: "Home", icon: HomeIcon, end: true },
  { to: PATHS.CUSTOMER_SEARCH, label: "Search", icon: SearchIcon },
  { to: PATHS.CUSTOMER_PRESCRIPTIONS, label: "Upload", icon: FileTextIcon },
];

/** Customer shell: fixed sidebar + sticky top bar + routed content. */
export default function CustomerLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <CustomerSidebar />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-foreground/5 bg-background/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            {/* Mobile brand */}
            <span className="flex items-center gap-2 lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <HeartPulseIcon className="size-4" />
              </span>
              <span className="font-heading text-sm font-semibold">PharmaHub</span>
            </span>
            <div className="hidden lg:block" />

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => toast("You're all caught up — no new notifications.")}
                className="relative flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifications"
              >
                <BellIcon className="size-[18px]" />
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="flex items-center gap-1 border-t border-foreground/5 px-3 py-2 lg:hidden">
            {MOBILE_NAV.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                      : "text-muted-foreground"
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
