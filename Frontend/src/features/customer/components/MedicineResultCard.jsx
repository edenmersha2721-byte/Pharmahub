import { MapPinIcon, NavigationIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistance, googleMapsDirectionsUrl } from "@/lib/helpers/helpers";

function stockTone(item) {
  if (!item.available || !item.stockQuantity) return { dot: "bg-rose-500", text: "text-rose-600", label: "Out of stock", bg: "bg-rose-500/10" };
  if (item.stockQuantity <= 10) return { dot: "bg-amber-500", text: "text-amber-600", label: `Low · ${item.stockQuantity} left`, bg: "bg-amber-500/10" };
  return { dot: "bg-emerald-500", text: "text-emerald-600", label: `In stock · ${item.stockQuantity}`, bg: "bg-emerald-500/10" };
}


export default function MedicineResultCard({ item, userCoords, active, onSelect }) {
  const price = item.price != null ? `ETB ${Number(item.price).toFixed(2)}` : "—";
  const stock = stockTone(item);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group flex cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-5 transition-all duration-300",
        active
          ? "border-indigo-500/60 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500/40"
          : "border-foreground/5 hover:-translate-y-1 hover:border-foreground/10 hover:shadow-xl hover:shadow-foreground/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-[15px] font-semibold text-foreground">
            {item.medicineName}
          </p>
          {(item.brandName || item.genericName) && (
            <p className="truncate text-xs text-muted-foreground">
              {[item.brandName, item.genericName].filter(Boolean).join(" • ")}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            stock.bg,
            stock.text
          )}
        >
          <span className={cn("size-1.5 rounded-full", stock.dot)} />
          {stock.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight text-foreground">{price}</span>
        {item.category && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {item.category}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-start gap-2 border-t border-foreground/5 pt-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
          <MapPinIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{item.pharmacyName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.address}
            {item.city ? `, ${item.city}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {item.distanceMeters != null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            <NavigationIcon className="size-3 text-indigo-600" />
            {formatDistance(item.distanceMeters)}
          </span>
        ) : (
          <span />
        )}
        <a
          href={googleMapsDirectionsUrl(item.latitude, item.longitude, userCoords?.lat, userCoords?.lng)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
          )}
        >
          <NavigationIcon className="size-3.5" />
          Navigate
        </a>
      </div>
    </div>
  );
}
