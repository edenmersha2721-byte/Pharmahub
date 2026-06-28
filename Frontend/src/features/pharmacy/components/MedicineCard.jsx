import { useEffect, useState } from "react";
import { PillIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStockStatus } from "@/features/pharmacy/constants";

const TODAY = new Date().toISOString().slice(0, 10);

function Stat({ label, value, danger }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-semibold", danger ? "text-rose-600" : "text-foreground")}>{value}</p>
    </div>
  );
}


export default function MedicineCard({ medicine: m, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = getStockStatus(m.stockQuantity);
  const expired = m.expiryDate && m.expiryDate < TODAY;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-foreground/5 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/10 hover:shadow-xl hover:shadow-foreground/5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600">
          <PillIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-sm font-semibold text-foreground">{m.medicineName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {m.category || m.brandName || m.genericName || "Medicine"}
          </p>
        </div>

        {/* kebab menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Actions"
          >
            <MoreVerticalIcon className="size-4" />
          </button>
          {menuOpen && (
            <>
              <button aria-hidden tabIndex={-1} className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-xl border border-foreground/10 bg-background/95 shadow-lg backdrop-blur-xl duration-150 animate-in fade-in-0 zoom-in-95">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.(m);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <PencilIcon className="size-3.5 text-muted-foreground" /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(m);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-500/10"
                >
                  <Trash2Icon className="size-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-foreground/5 pt-3">
        <Stat label="Stock" value={m.stockQuantity} danger={!m.stockQuantity} />
        <Stat label="Price" value={m.price != null ? `ETB ${Number(m.price).toFixed(2)}` : "—"} />
        <Stat
          label="Expiry"
          value={m.expiryDate ?? "—"}
          danger={expired}
        />
      </div>

      <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", status.bg, status.text)}>
        <span className={cn("size-1.5 rounded-full", status.dot)} />
        {status.label}
      </span>
    </div>
  );
}
