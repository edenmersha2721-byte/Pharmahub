import { Link } from "react-router-dom";
import {
  HeartPulseIcon,
  MapPinIcon,
  ShieldCheckIcon,
  BellRingIcon,
  ScanLineIcon,
  PillIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
  UserPlusIcon,
  LogInIcon,
} from "lucide-react";
import { PATHS } from "@/router/routes";

const FEATURES = [
  {
    icon: MapPinIcon,
    title: "Find medicine nearby",
    desc: "Search any medicine and instantly see which nearby pharmacies have it in stock — with distance and directions.",
  },
  {
    icon: ScanLineIcon,
    title: "AI prescription scanning",
    desc: "Upload a photo of your prescription and our AI reads it, extracts the medicines, and matches them for you.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified hospitals",
    desc: "Prescriptions are checked against connected hospitals, so pharmacies can trust what they dispense.",
  },
  {
    icon: BellRingIcon,
    title: "Real-time stock",
    desc: "Pharmacies keep their inventory live, so you never travel for a medicine that's already sold out.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Create your account",
    desc: "Sign up as a customer to find medicine, or register your pharmacy to reach more patients.",
  },
  {
    n: "2",
    title: "Search or upload",
    desc: "Type a medicine name to search nearby pharmacies, or upload a prescription and let the AI do the reading.",
  },
  {
    n: "3",
    title: "Find it & go",
    desc: "See which pharmacy has your medicine in stock, get directions, and pick it up — no wasted trips.",
  },
];

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
            <HeartPulseIcon className="size-5" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">PharmaHub</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#pharmacies" className="transition-colors hover:text-foreground">For pharmacies</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={PATHS.LOGIN}
            className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/10 bg-background px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
          >
            <LogInIcon className="size-4" /> Log in
          </Link>
          <Link
            to={PATHS.REGISTER}
            className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] sm:inline-flex"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-72 max-w-3xl rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-xs font-semibold text-indigo-700">
          <SparklesIcon className="size-3.5" /> AI-powered medicine finder
        </span>

        <h1 className="mx-auto mt-5 max-w-3xl font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          Find the medicine you need,{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            at a pharmacy near you
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          PharmaHub connects patients with nearby pharmacies in real time. Search any medicine,
          upload a prescription, and see exactly where it's in stock — no more pharmacy-hopping.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={PATHS.REGISTER}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] sm:w-auto"
          >
            Get started free <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            to={PATHS.LOGIN}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-indigo-500/40 hover:text-indigo-700 sm:w-auto"
          >
            I already have an account
          </Link>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CheckIcon className="size-3.5 text-emerald-500" /> Free for patients · No credit card required
        </p>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to get your medicine
        </h2>
        <p className="mt-3 text-muted-foreground">
          Built to remove the guesswork — for patients and pharmacies alike.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-foreground/5 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-foreground/5 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How PharmaHub works
          </h2>
          <p className="mt-3 text-muted-foreground">Three steps from "where do I get this?" to done.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              {i < STEPS.length - 1 && (
                <div aria-hidden className="absolute left-[3.25rem] top-6 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-indigo-500/30 to-transparent md:block" />
              )}
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 font-heading text-lg font-bold text-white shadow-lg shadow-indigo-600/25">
                {s.n}
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PharmacyStrip() {
  return (
    <section id="pharmacies" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white sm:p-12">
        <PillIcon aria-hidden className="absolute -right-6 -top-6 size-40 text-white/10" />
        <div className="relative max-w-xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Run a pharmacy? Reach more patients.
          </h2>
          <p className="mt-3 text-white/85">
            List your inventory on PharmaHub, keep stock updated in real time, and let nearby
            patients find you the moment they search for a medicine you carry.
          </p>
          <ul className="mt-5 flex flex-col gap-2 text-sm text-white/90">
            {["Live inventory management", "Show up in local medicine searches", "Verify prescriptions with confidence"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="size-4 shrink-0" /> {t}
              </li>
            ))}
          </ul>
          <Link
            to={PATHS.REGISTER}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Register your pharmacy <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 text-center sm:px-6">
      <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Stop hunting for your medicine
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        Join PharmaHub today and find what you need, faster.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to={PATHS.REGISTER}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] sm:w-auto"
        >
          <UserPlusIcon className="size-4" /> Create free account
        </Link>
        <Link
          to={PATHS.LOGIN}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-indigo-500/40 hover:text-indigo-700 sm:w-auto"
        >
          <LogInIcon className="size-4" /> Log in
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-foreground/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <HeartPulseIcon className="size-4" />
          </span>
          <span className="font-heading font-semibold text-foreground">PharmaHub</span>
        </div>
        <p>&copy; {new Date().getFullYear()} PharmaHub. Find medicines. Save time.</p>
        <div className="flex items-center gap-5">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <Link to={PATHS.LOGIN} className="transition-colors hover:text-foreground">Log in</Link>
        </div>
      </div>
    </footer>
  );
}

/** Public marketing landing page shown at "/" for logged-out visitors. */
export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PharmacyStrip />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
