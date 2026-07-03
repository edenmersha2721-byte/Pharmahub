import { Link } from "react-router-dom";
import {
  HeartPulseIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ScanLineIcon,
  SearchIcon,
} from "lucide-react";

const HERO_FEATURES = [
  { icon: SearchIcon, title: "20,000+ medicines", sub: "Searchable in seconds" },
  { icon: MapPinIcon, title: "Nearby pharmacies", sub: "Sorted by distance" },
  { icon: ScanLineIcon, title: "AI prescriptions", sub: "Scan & match instantly" },
];

/** The dark, photo-backed brand panel shared by the Login and Register pages. */
export default function AuthHeroPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-indigo-900 p-10 text-white lg:flex">
      {/* Background photo */}
      <img
        src="/the background image.png"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      {/* Purple tint over the photo so text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-indigo-800/85 via-indigo-900/80 to-violet-900/90"
      />
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-violet-500/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-indigo-400/15 blur-3xl" />

      {/* Brand (click to return to the landing page) */}
      <Link to="/" className="relative flex w-fit items-center gap-3 transition-opacity hover:opacity-90">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <HeartPulseIcon className="size-6" />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-xl font-bold tracking-tight">PharmaHub</p>
          <p className="text-xs text-white/70">Find medicines. Save time.</p>
        </div>
      </Link>

      {/* Headline */}
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur">
          <ShieldCheckIcon className="size-3.5" /> Trusted pharmacy network
        </span>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-[1.05] tracking-tight">
          Better care.
          <br />
          Smarter health.
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
          PharmaHub helps you find medicines at nearby pharmacies, scan prescriptions with AI,
          and see real-time stock — so you never travel for a medicine that's already sold out.
        </p>
      </div>

      {/* Feature chips */}
      <div className="relative grid grid-cols-3 gap-4">
        {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
          <div key={title}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Icon className="size-4" />
            </span>
            <p className="mt-2 text-sm font-semibold">{title}</p>
            <p className="text-xs text-white/60">{sub}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
