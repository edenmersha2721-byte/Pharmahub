import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  PillIcon,
  LayoutDashboardIcon,
  BoxesIcon,
  PlusIcon,
  MapPinIcon,
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/router/routes";
import { cn } from "@/lib/utils";
import PharmacySidebar from "@/features/pharmacy/components/PharmacySidebar";

const MOBILE_NAV = [
  { to: PATHS.PHARMACY_HOME, label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: PATHS.PHARMACY_INVENTORY, label: "Medicines", icon: BoxesIcon },
  { to: `${PATHS.PHARMACY_INVENTORY}?add=1`, label: "Add", icon: PlusIcon },
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
          <UserIcon className="size-4" />
        </span>
        <span className="hidden text-sm font-medium text-foreground sm:block">Pharmacist</span>
        <ChevronDownIcon className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 shadow-xl shadow-foreground/5 backdrop-blur-xl duration-150 animate-in fade-in-0 zoom-in-95">
            <div className="border-b border-foreground/5 p-3">
              <p className="text-xs font-medium text-muted-foreground">Pharmacy account</p>
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

/** Pharmacy shell: fixed sidebar + sticky top bar + routed content. */
export default function PharmacyLayout() {
  const { user, logout } = useAuth();
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
              <button
                onClick={() => toast("You're all caught up — no new alerts.")}
                className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifications"
              >
                <BellIcon className="size-[18px]" />
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
