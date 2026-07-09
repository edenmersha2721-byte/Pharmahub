import { statusMeta } from "@/features/reports/constants";
import { cn } from "@/lib/utils";

export default function ReportStatusBadge({ status, className }) {
  const m = statusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        m.badge,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
