import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, XIcon, Building2Icon } from "lucide-react";
import { usePharmacies } from "@/features/admin/hooks/usePharmacies";
import EmptyState from "@/features/customer/components/EmptyState";
import { extractApiError } from "@/lib/helpers/helpers";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "ALL", label: "All" },
];

const VALID = ["PENDING", "APPROVED", "REJECTED"];

export default function ManagePharmacyPage() {
 
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("status");
  const activeTab = raw === "ALL" ? "ALL" : VALID.includes(raw) ? raw : "PENDING";
  const urlStatus = activeTab === "ALL" ? null : activeTab; // null = all

  const { items, status, changeStatus, page, setPage, meta, loading, error, approve, reject } =
    usePharmacies({ initialStatus: urlStatus });

  
  useEffect(() => {
    if (urlStatus === status) return;
    const id = setTimeout(() => changeStatus(urlStatus), 0);
    return () => clearTimeout(id);
  }, [urlStatus, status, changeStatus]);

  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const totalPages = meta.totalPages || 0;
  const tone = (status) => {
    switch (status) {
      case "APPROVED":
        return { label: "Approved", badge: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500" };
      case "REJECTED":
        return { label: "Rejected", badge: "bg-rose-500/10 text-rose-600", dot: "bg-rose-500" };
      default:
        return { label: "Pending", badge: "bg-amber-500/10 text-amber-600", dot: "bg-amber-500" };
    }
  };

  const run = async (id, fn) => {
    setProcessingId(id);
    setActionError("");
    try {
      await fn(id);
    } catch (e) {
      setActionError(extractApiError(e, "Action failed. Please try again."));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Pharmacies</h1>
        <p className="text-sm text-muted-foreground">
          {meta.totalElements} pharmac{meta.totalElements === 1 ? "y" : "ies"}
          {activeTab !== "ALL" ? ` · ${activeTab.toLowerCase()}` : ""}
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex w-fit items-center gap-1 rounded-xl border border-foreground/10 bg-background p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSearchParams({ status: t.key })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === t.key
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(error || actionError) && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error || actionError}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-foreground/5 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pharmacy</TableHead>
              <TableHead>License</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Loading pharmacies…
                </TableCell>
              </TableRow>
            )}

            {!loading && items.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={Building2Icon}
                    title="No pharmacies here"
                    subtitle={status === "PENDING" ? "No pharmacies awaiting approval." : "Nothing to show for this filter."}
                  />
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              items.map((p) => {
                const t = tone(p.pharmacyStatus);
                const busy = processingId === p.id;
                const canApprove = p.pharmacyStatus !== "APPROVED";
                const canReject = p.pharmacyStatus !== "REJECTED";
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="font-medium text-foreground">{p.pharmacyName}</span>
                      <span className="block text-xs text-muted-foreground">{p.email}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.licenseNumber ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.city ?? "—"}</TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", t.badge)}>
                        <span className={cn("size-1.5 rounded-full", t.dot)} />
                        {t.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {canApprove && (
                          <button
                            disabled={busy}
                            onClick={() => run(p.id, approve)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                          >
                            <CheckIcon className="size-3.5" /> {busy ? "…" : "Approve"}
                          </button>
                        )}
                        {canReject && (
                          <button
                            disabled={busy}
                            onClick={() => run(p.id, reject)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600/10 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-600/20 disabled:opacity-50"
                          >
                            <XIcon className="size-3.5" /> Reject
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
}
