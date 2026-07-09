import { Link } from "react-router-dom";
import {
  SearchIcon,
  UploadCloudIcon,
  ArrowRightIcon,
  MapPinIcon,
  PackageCheckIcon,
  TagIcon,
  ScanLineIcon,
  NavigationIcon,
  ShieldCheckIcon,
  PlusIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDisplayName } from "@/features/auth/hooks/useDisplayName";
import { PATHS } from "@/router/routes";

const ACTIONS = [
  {
    to: PATHS.CUSTOMER_SEARCH,
    title: "Search Medicine",
    desc: "Find medicines by name",
    icon: SearchIcon,
    tone: "from-indigo-500/15 to-indigo-500/5 text-indigo-600",
  },
  {
    to: PATHS.CUSTOMER_PRESCRIPTIONS,
    title: "Upload Prescription",
    desc: "We'll extract medicines for you",
    icon: UploadCloudIcon,
    tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
  },
];

const FEATURES = [
  { icon: MapPinIcon, color: "text-indigo-600 bg-indigo-500/10", title: "Nearby Pharmacies", desc: "Find the closest pharmacies" },
  { icon: PackageCheckIcon, color: "text-emerald-600 bg-emerald-500/10", title: "Real-time Stock", desc: "Live inventory data" },
  { icon: TagIcon, color: "text-cyan-600 bg-cyan-500/10", title: "Compare Prices", desc: "Best prices nearby" },
  { icon: ScanLineIcon, color: "text-violet-600 bg-violet-500/10", title: "Prescription Scan", desc: "OCR extracts your medicines" },
];

const STEPS = [
  { n: 1, icon: SearchIcon, title: "Search or Upload", desc: "Search by name or upload a prescription" },
  { n: 2, icon: MapPinIcon, title: "Compare nearby", desc: "See pharmacies, stock & price near you" },
  { n: 3, icon: NavigationIcon, title: "Navigate & collect", desc: "Get directions and pick up" },
];

const POPULAR = ["Paracetamol", "Amoxicillin", "Ibuprofen", "Vitamin C", "Omeprazole", "Cetirizine"];

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const displayName = useDisplayName();
  const name = displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-foreground/5 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-cyan-500/5 p-6 sm:p-8">
        <div className="ml-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Find medicines
              <br className="hidden sm:block" /> near you, <span className="ml-gradient-text">instantly</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Welcome back, {name}. Search, compare and find medicines in nearby pharmacies with ease.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ACTIONS.map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="group flex items-center gap-3 rounded-2xl border border-foreground/5 bg-background/80 p-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <span className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${a.tone}`}>
                    <a.icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                </Link>
              ))}
            </div>
          </div>

          {/* Decorative map teaser */}
          <Link
            to={PATHS.CUSTOMER_SEARCH}
            className="group relative hidden h-56 overflow-hidden rounded-2xl border border-foreground/5 bg-gradient-to-br from-indigo-100 to-violet-100 lg:block"
          >
            <div className="ml-grid-bg absolute inset-0 opacity-50" aria-hidden />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="ml-pulse-soft flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30">
                <PlusIcon className="size-7" />
              </span>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-2xl border border-foreground/5 bg-background/90 px-4 py-3 shadow-lg backdrop-blur transition-transform group-hover:-translate-y-0.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Pharmacies near you</p>
                <p className="text-xs text-muted-foreground">Tap to find what's in stock</p>
              </div>
              <ArrowRightIcon className="size-4 text-indigo-600" />
            </div>
          </Link>
        </div>
      </section>

      {/* Feature strip */}
      <section className="grid gap-3 rounded-2xl border border-foreground/5 bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-center gap-3 rounded-xl p-2">
            <span className={`flex size-10 items-center justify-center rounded-xl ${f.color}`}>
              <f.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* How it works + Popular searches */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-foreground/5 bg-card p-6">
          <h2 className="font-heading text-base font-semibold">How it works</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600">
                  <s.icon className="size-6" />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-[10px] font-bold text-white">
                    {s.n}
                  </span>
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/5 bg-card p-6">
          <h2 className="font-heading text-base font-semibold">Popular searches</h2>
          <p className="mt-1 text-xs text-muted-foreground">Jump straight to a common medicine.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR.map((med) => (
              <Link
                key={med}
                to={`${PATHS.CUSTOMER_SEARCH}?q=${encodeURIComponent(med)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-700"
              >
                <SearchIcon className="size-3.5 text-muted-foreground" />
                {med}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust banner */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
            <ShieldCheckIcon className="size-5" />
          </span>
          <div>
            <p className="font-heading text-base font-semibold">Your health, our priority</p>
            <p className="text-sm text-white/80">Verified pharmacies and genuine medicines, every time.</p>
          </div>
        </div>
        <Link
          to={PATHS.CUSTOMER_SEARCH}
          className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/25"
        >
          Start searching
          <ArrowRightIcon className="size-4" />
        </Link>
      </section>
    </div>
  );
}
