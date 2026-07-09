import { Loader2Icon } from "lucide-react";
import { useOpenStatus } from "@/features/pharmacy/hooks/useOpenStatus";
import { cn } from "@/lib/utils";

/**
 * Top-bar pill letting a pharmacy flip between Open (visible in customer search)
 * and Closed (hidden). Reflects the state returned by the backend.
 */
export default function OpenStatusToggle() {
  const { open, saving, toggle } = useOpenStatus();

  return (
    <button
      onClick={toggle}
      disabled={saving}
      title={open ? "You're open — click to close" : "You're closed — click to open"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-70",
        open
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
          : "border-foreground/10 bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {saving ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : (
        <span className="relative flex size-2">
          {open && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className={cn("relative inline-flex size-2 rounded-full", open ? "bg-emerald-500" : "bg-muted-foreground/50")} />
        </span>
      )}
      {open ? "Open" : "Closed"}
    </button>
  );
}
