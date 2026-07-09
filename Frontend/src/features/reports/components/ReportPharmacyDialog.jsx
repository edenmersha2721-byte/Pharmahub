import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FlagIcon, Loader2Icon } from "lucide-react";
import { REPORT_CATEGORIES } from "@/features/reports/constants";
import { submitReport } from "@/features/reports/api/reportApi";
import { extractApiError } from "@/lib/helpers/helpers";
import { cn } from "@/lib/utils";

/**
 * Customer dialog to report an issue with a pharmacy. `pharmacy` needs
 * { pharmacyId, pharmacyName }.
 */
export default function ReportPharmacyDialog({ pharmacy, open, onClose }) {
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleOpenChange(next) {
    if (next) return;
    setCategory(null);
    setDescription("");
    setError("");
    setSubmitting(false);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!category) {
      setError("Please choose what went wrong.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitReport({
        pharmacyId: pharmacy.pharmacyId,
        category,
        description: description.trim(),
      });
      toast.success("Report submitted. Thanks for helping keep PharmaHub reliable.");
      handleOpenChange(false);
    } catch (err) {
      setError(extractApiError(err, "Could not submit your report. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlagIcon className="size-5 text-rose-500" />
            Report an issue
          </DialogTitle>
          <DialogDescription>
            {pharmacy?.pharmacyName ? (
              <>Tell us what went wrong at <span className="font-medium text-foreground">{pharmacy.pharmacyName}</span>.</>
            ) : (
              "Tell us what went wrong at this pharmacy."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category picker */}
          <div className="grid grid-cols-2 gap-2">
            {REPORT_CATEGORIES.map(({ value, label, icon: Icon, tone }) => {
              const selected = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setCategory(value);
                    setError("");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-2.5 text-left text-sm font-medium transition-all",
                    selected
                      ? "border-indigo-500/60 bg-indigo-500/5 ring-1 ring-indigo-500/30"
                      : "border-foreground/10 hover:border-foreground/20"
                  )}
                >
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tone)}>
                    <Icon className="size-4" />
                  </span>
                  <span className="leading-tight">{label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="report-desc" className="mb-1.5 block text-sm font-medium text-foreground">
              Describe what happened
            </label>
            <textarea
              id="report-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              placeholder="Add any details that help us understand the issue…"
              className="w-full resize-none rounded-xl border border-foreground/10 bg-background p-3 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">{description.length}/2000</p>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit report"
            )}
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            Reports are reviewed fairly — the pharmacy can respond before any action is taken.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
