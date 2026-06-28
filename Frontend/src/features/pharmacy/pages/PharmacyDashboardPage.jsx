import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  PlusIcon,
  PackageIcon,
  PackageCheckIcon,
  AlertTriangleIcon,
  XCircleIcon,
  UploadIcon,
  ScanBarcodeIcon,
  DownloadIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useInventory } from "@/features/pharmacy/hooks/useInventory";
import { getStockStatus } from "@/features/pharmacy/constants";
import MedicineCard from "@/features/pharmacy/components/MedicineCard";
import MedicineFormDialog from "@/features/pharmacy/components/MedicineFormDialog";
import DeleteMedicineDialog from "@/features/pharmacy/components/DeleteMedicineDialog";
import ResultCardSkeleton from "@/features/customer/components/ResultCardSkeleton";
import EmptyState from "@/features/customer/components/EmptyState";
import { PATHS } from "@/router/routes";

function exportCsv(items) {
  if (!items.length) {
    toast.error("Nothing to export yet.");
    return;
  }
  const headers = ["Medicine", "Generic", "Brand", "Category", "Price", "Stock", "Expiry", "RequiresPrescription"];
  const esc = (v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`;
  const rows = items.map((m) =>
    [m.medicineName, m.genericName, m.brandName, m.category, m.price, m.stockQuantity, m.expiryDate, m.requiresPrescription]
      .map(esc)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventory.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Inventory exported");
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
      <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-foreground/5 bg-card p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-foreground/5"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 transition-colors group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white">
        <Icon className="size-5" />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  );
}

export default function PharmacyDashboardPage() {
  const { user } = useAuth();
  
  const { items, meta, loading, error, create, update, remove } = useInventory({ pageSize: 100 });

  const [editing, setEditing] = useState(null); // null | { medicine|null }
  const [deleting, setDeleting] = useState(null);

  const stats = useMemo(() => {
    let inStock = 0;
    let low = 0;
    let out = 0;
    for (const m of items) {
      const k = getStockStatus(m.stockQuantity).key;
      if (k === "in") inStock += 1;
      else if (k === "low") low += 1;
      else out += 1;
    }
    return { inStock, low, out };
  }, [items]);

  const recent = items.slice(0, 8);
  const name = user?.email?.split("@")[0] ?? "Pharmacist";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Welcome back, {name}! 👋</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening at your pharmacy today.</p>
        </div>
        <button
          onClick={() => setEditing({ medicine: null })}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
        >
          <PlusIcon className="size-4" />
          Add New Medicine
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={PackageIcon} label="Total Medicines" value={meta.totalElements} tone="bg-indigo-500/10 text-indigo-600" />
        <StatCard icon={PackageCheckIcon} label="In Stock" value={stats.inStock} tone="bg-emerald-500/10 text-emerald-600" />
        <StatCard icon={AlertTriangleIcon} label="Low Stock" value={stats.low} tone="bg-amber-500/10 text-amber-600" />
        <StatCard icon={XCircleIcon} label="Out of Stock" value={stats.out} tone="bg-rose-500/10 text-rose-600" />
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-foreground/5 bg-muted/30 p-5">
        <h2 className="mb-3 font-heading text-sm font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction icon={PlusIcon} label="Add Medicine" onClick={() => setEditing({ medicine: null })} />
          <QuickAction icon={DownloadIcon} label="Export Inventory" onClick={() => exportCsv(items)} />
          <QuickAction icon={UploadIcon} label="Bulk Upload" onClick={() => toast("Bulk upload is coming soon.")} />
          <QuickAction icon={ScanBarcodeIcon} label="Scan Barcode" onClick={() => toast("Barcode scanning is coming soon.")} />
        </div>
      </div>

      {/* Recent medicines */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Your Medicines</h2>
          <Link
            to={PATHS.PHARMACY_INVENTORY}
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ResultCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && recent.length === 0 && !error && (
          <EmptyState
            icon={PackageIcon}
            title="No medicines yet"
            subtitle="Add your first medicine to start building your inventory."
          />
        )}

        {!loading && recent.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((m) => (
              <MedicineCard
                key={m.id}
                medicine={m}
                onEdit={(med) => setEditing({ medicine: med })}
                onDelete={(med) => setDeleting(med)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {editing && (
        <MedicineFormDialog
          key={editing.medicine?.id ?? "new"}
          initialValue={editing.medicine}
          onClose={() => setEditing(null)}
          onSubmit={(payload) =>
            editing.medicine ? update(editing.medicine.id, payload) : create(payload)
          }
        />
      )}
      {deleting && (
        <DeleteMedicineDialog
          medicine={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => remove(deleting.id)}
        />
      )}
    </div>
  );
}
