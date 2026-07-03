import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HospitalIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  PlusIcon,
  CopyIcon,
} from "lucide-react";
import { useHospitalConnections } from "@/features/admin/hooks/useHospitalConnections";
import RegisterHospitalDialog from "@/features/admin/components/RegisterHospitalDialog";
import { cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="rounded-2xl border border-foreground/5 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
      <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="font-heading text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Hospital ID copied");
  } catch {
    toast.error("Couldn't copy — please copy it manually.");
  }
}

export default function ManageHospitalPage() {
  const { items, loading, error, create } = useHospitalConnections();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const active = items.filter((h) => h.active).length;
  const inactive = items.length - active;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((h) =>
      [h.name, h.email, h.hospitalId, h.baseUrl]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Hospitals</h1>
        <p className="text-sm text-muted-foreground">
          Onboard and manage hospitals connected to the prescription verification directory.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={HospitalIcon} label="Connected Hospitals" value={loading ? "…" : items.length} tone="bg-indigo-500/10 text-indigo-600" hint="in the directory" />
        <StatCard icon={CheckCircle2Icon} label="Active" value={loading ? "…" : active} tone="bg-emerald-500/10 text-emerald-600" hint="able to verify" />
        <StatCard icon={XCircleIcon} label="Inactive" value={loading ? "…" : inactive} tone="bg-rose-500/10 text-rose-600" hint="disconnected" />
      </div>

      {/* Table card */}
      <section className="overflow-hidden rounded-2xl border border-foreground/5 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/5 p-5">
          <div>
            <h2 className="font-heading text-base font-semibold">Connected Hospitals</h2>
            <p className="text-sm text-muted-foreground">Each hospital gets a unique generated ID.</p>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="relative min-w-48 flex-1 sm:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospitals…"
                className="h-9 w-full rounded-xl border border-foreground/10 bg-background pl-9 pr-3 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10"
              />
            </div>
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
            >
              <PlusIcon className="size-4" /> Register Hospital
            </button>
          </div>
        </div>

        {error && (
          <p className="m-5 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Hospital ID</TableHead>
              <TableHead>Base URL</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">Loading hospitals…</TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  {items.length === 0
                    ? "No hospitals connected yet. Register one to get started."
                    : "No hospitals match your search."}
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                        <HospitalIcon className="size-4" />
                      </span>
                      <span className="font-medium text-foreground">{h.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{h.email}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => copy(h.hospitalId)}
                      title="Copy ID"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-500/20"
                    >
                      {h.hospitalId}
                      <CopyIcon className="size-3" />
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[16rem] truncate text-muted-foreground">{h.baseUrl}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className={cn("size-1.5 rounded-full", h.active ? "bg-emerald-500" : "bg-rose-500")} />
                      {h.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>

      <RegisterHospitalDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={create}
      />
    </div>
  );
}
