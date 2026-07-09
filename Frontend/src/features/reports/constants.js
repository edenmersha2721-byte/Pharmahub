import {
  StoreIcon,
  PackageXIcon,
  TagIcon,
  CalendarXIcon,
  FrownIcon,
  MessageSquareIcon,
} from "lucide-react";

/** Report categories — must match the backend ReportCategory enum. */
export const REPORT_CATEGORIES = [
  {
    value: "PHARMACY_CLOSED",
    label: "Pharmacy was closed",
    hint: "It showed as open but was closed when I arrived.",
    icon: StoreIcon,
    tone: "bg-amber-500/10 text-amber-600",
  },
  {
    value: "MEDICINE_UNAVAILABLE",
    label: "Medicine unavailable",
    hint: "Listed in stock but they didn't actually have it.",
    icon: PackageXIcon,
    tone: "bg-rose-500/10 text-rose-600",
  },
  {
    value: "WRONG_PRICE",
    label: "Wrong price",
    hint: "The price charged didn't match what was listed.",
    icon: TagIcon,
    tone: "bg-violet-500/10 text-violet-600",
  },
  {
    value: "EXPIRED_MEDICINE",
    label: "Expired medicine",
    hint: "They offered medicine that was past its expiry date.",
    icon: CalendarXIcon,
    tone: "bg-rose-500/10 text-rose-600",
  },
  {
    value: "RUDE_SERVICE",
    label: "Rude service",
    hint: "Staff were unprofessional or unhelpful.",
    icon: FrownIcon,
    tone: "bg-orange-500/10 text-orange-600",
  },
  {
    value: "OTHER",
    label: "Something else",
    hint: "A different issue not listed above.",
    icon: MessageSquareIcon,
    tone: "bg-slate-500/10 text-slate-600",
  },
];

const CATEGORY_MAP = Object.fromEntries(REPORT_CATEGORIES.map((c) => [c.value, c]));

export function categoryMeta(value) {
  return CATEGORY_MAP[value] ?? REPORT_CATEGORIES[REPORT_CATEGORIES.length - 1];
}

/** Report lifecycle statuses — must match the backend ReportStatus enum. */
export const REPORT_STATUS = {
  PENDING: { label: "Pending", badge: "bg-amber-500/10 text-amber-600", dot: "bg-amber-500" },
  AWAITING_PHARMACY_RESPONSE: { label: "Awaiting response", badge: "bg-indigo-500/10 text-indigo-600", dot: "bg-indigo-500" },
  UNDER_REVIEW: { label: "Under review", badge: "bg-violet-500/10 text-violet-600", dot: "bg-violet-500" },
  RESOLVED: { label: "Resolved", badge: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500" },
  DISMISSED: { label: "Dismissed", badge: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" },
};

export function statusMeta(value) {
  return REPORT_STATUS[value] ?? { label: value, badge: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" };
}

const UNRESOLVED = new Set(["PENDING", "AWAITING_PHARMACY_RESPONSE", "UNDER_REVIEW"]);
export const isUnresolved = (status) => UNRESOLVED.has(status);
