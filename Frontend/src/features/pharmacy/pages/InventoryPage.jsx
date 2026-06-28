import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PlusIcon, SearchIcon, PackageIcon } from "lucide-react";
import { useInventory } from "@/features/pharmacy/hooks/useInventory";
import MedicineCard from "@/features/pharmacy/components/MedicineCard";
import { getStockStatus } from "@/features/pharmacy/constants";
import MedicineFormDialog from "@/features/pharmacy/components/MedicineFormDialog";
import DeleteMedicineDialog from "@/features/pharmacy/components/DeleteMedicineDialog";
import ResultCardSkeleton from "@/features/customer/components/ResultCardSkeleton";
import EmptyState from "@/features/customer/components/EmptyState";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "in", label: "In Stock" },
  { key: "low", label: "Low" },
  { key: "out", label: "Out" },
];

export default function InventoryPage() {
  const { items, page, setPage, meta, loading, error, create, update, remove } = useInventory();

  const [searchParams] = useSearchParams();
  // Open the Add dialog immediately when arriving via "Add Medicine" (?add=1).
  const [editing, setEditing] = useState(() =>
    searchParams.get("add") ? { medicine: null } : null
  );
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((m) => {
      const matchesQuery =
        !q ||
        [m.medicineName, m.brandName, m.genericName, m.category]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === "all" || getStockStatus(m.stockQuantity).key === status;
      return matchesQuery && matchesStatus;
    });
  }, [items, search, status]);

  const totalPages = meta.totalPages || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">All Medicines</h1>
          <p className="text-sm text-muted-foreground">
            {meta.totalElements} medicine{meta.totalElements === 1 ? "" : "s"} in your catalogue
          </p>
        </div>
        <button
          onClick={() => setEditing({ medicine: null })}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
        >
          <PlusIcon className="size-4" />
          Add Medicine
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine on this page…"
            className="h-10 w-full rounded-xl border border-foreground/10 bg-background pl-9 pr-3 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-foreground/10 bg-background p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                status === f.key
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Grid */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={PackageIcon}
          title={items.length === 0 ? "No medicines yet" : "No matches on this page"}
          subtitle={
            items.length === 0
              ? "Click “Add Medicine” to create your first entry."
              : "Try a different search term or status filter."
          }
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((m) => (
            <MedicineCard
              key={m.id}
              medicine={m}
              onEdit={(med) => setEditing({ medicine: med })}
              onDelete={(med) => setDeleting(med)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1 || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

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
