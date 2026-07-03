import { Link } from "react-router-dom";
import { ShieldCheckIcon, BadgeCheckIcon, ScanLineIcon, ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthHeroPanel from "@/features/auth/components/AuthHeroPanel";

const TRUST = [
  { icon: ShieldCheckIcon, title: "Secure & private", sub: "Your data is protected" },
  { icon: BadgeCheckIcon, title: "Verified pharmacies", sub: "Admin-approved network" },
  { icon: ScanLineIcon, title: "AI-powered", sub: "Smart prescription scan" },
];

/**
 * Split-screen auth shell: photo brand panel on the left, a curved seam, and
 * the form content on the right with a shared trust strip.
 *
 * @param {boolean} [wide] widen the content column (for the longer register form)
 */
export default function AuthSplitLayout({ children, wide = false }) {
  return (
    <div className="min-h-screen bg-card">
      <div className="grid min-h-screen w-full overflow-hidden bg-card lg:grid-cols-2">
        <AuthHeroPanel />

        {/* ---- Right: form ---- */}
        <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          {/* Back to the landing page */}
          <Link
            to="/"
            className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-700"
          >
            <ArrowLeftIcon className="size-4" /> Back to home
          </Link>

          {/* Curved seam: the white panel waves into the photo panel */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="currentColor"
            className="absolute inset-y-0 left-0 hidden h-full w-24 -translate-x-[calc(100%-2px)] text-card lg:block"
          >
            <path d="M100,0 C38,28 38,72 100,100 Z" />
          </svg>

          <div className={cn("relative mx-auto w-full", wide ? "max-w-md" : "max-w-sm")}>
            {children}

            {/* Trust strip */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-foreground/5 pt-6">
              {TRUST.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="size-5 text-indigo-600" />
                  <p className="text-xs font-semibold text-foreground">{title}</p>
                  <p className="text-[11px] leading-tight text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
