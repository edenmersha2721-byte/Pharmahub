import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UsersIcon,
  Building2Icon,
  ClockIcon,
  CheckCircle2Icon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
} from "lucide-react";
import { usePharmacies } from "@/features/admin/hooks/usePharmacies";
import { useUsers } from "@/features/admin/hooks/useUsers";
import { accountStatusTone } from "@/features/admin/api/adminApi";
import { PATHS } from "@/router/routes";
import { formatDate, timeAgo, extractApiError } from "@/lib/helpers/helpers";
import { cn } from "@/lib/utils";

const ROLE_STYLES = {
  ADMIN: "bg-violet-500/10 text-violet-600",
  PHARMACY: "bg-indigo-500/10 text-indigo-600",
  CUSTOMER: "bg-emerald-500/10 text-emerald-600",
};

function StatCard({ icon: Icon, label, value, hint, hintTone, tone }) {
  return (
    <div className="rounded-2xl border border-foreground/5 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
      <div className="flex items-center justify-between">
        <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="font-heading text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className={cn("mt-0.5 text-xs font-medium", hintTone)}>{hint}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, statsLoading, refreshStats } = useOutletContext();
  const pending = usePharmacies({ initialStatus: "PENDING" });
  const users = useUsers();

  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const num = (v) => (statsLoading ? "…" : v);

  const run = async (id, fn) => {
    setProcessingId(id);
    setActionError("");
    try {
      await fn(id);
      refreshStats();
    } catch (e) {
      setActionError(extractApiError(e, "Action failed. Please try again."));
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRows = pending.items.slice(0, 5);
  const userRows = users.items.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage users and pharmacy registrations.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UsersIcon} label="Total Users" value={num(stats.totalUsers)} tone="bg-indigo-500/10 text-indigo-600" hint="on the platform" hintTone="text-muted-foreground" />
        <StatCard icon={Building2Icon} label="Total Pharmacies" value={num(stats.totalPharmacies)} tone="bg-violet-500/10 text-violet-600" hint="registered" hintTone="text-muted-foreground" />
        <StatCard icon={ClockIcon} label="Pending Approvals" value={num(stats.pending)} tone="bg-amber-500/10 text-amber-600" hint={stats.pending > 0 ? "Requires action" : "All clear"} hintTone={stats.pending > 0 ? "text-amber-600" : "text-emerald-600"} />
        <StatCard icon={CheckCircle2Icon} label="Approved Pharmacies" value={num(stats.approved)} tone="bg-emerald-500/10 text-emerald-600" hint="live & visible" hintTone="text-muted-foreground" />
      </div>

      {actionError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{actionError}</p>
      )}

      {/* Pending approvals */}
      <section className="overflow-hidden rounded-2xl border border-foreground/5 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/5 p-5">
          <div>
            <h2 className="font-heading text-base font-semibold">Pending Pharmacy Approvals</h2>
            <p className="text-sm text-muted-foreground">Review and approve new pharmacy registrations.</p>
          </div>
          <Link
            to={`${PATHS.ADMIN_PHARMACIES}?status=PENDING`}
            className="inline-flex items-center gap-1 rounded-lg border border-foreground/10 px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
          >
            View All Pending <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pending.loading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Loading…</TableCell>
              </TableRow>
            )}
            {!pending.loading && pendingRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No pharmacies awaiting approval. 🎉
                </TableCell>
              </TableRow>
            )}
            {!pending.loading &&
              pendingRows.map((p) => {
                const busy = processingId === p.id;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                          <Building2Icon className="size-4" />
                        </span>
                        <div>
                          <span className="font-medium text-foreground">{p.pharmacyName}</span>
                          <span className="block text-xs text-muted-foreground">{p.licenseNumber ?? "—"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-muted-foreground">{p.phoneNumber ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.city ?? "—"}</TableCell>
                    <TableCell>
                      <span className="text-foreground">{formatDate(p.createdAt)}</span>
                      <span className="block text-xs text-muted-foreground">{timeAgo(p.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          disabled={busy}
                          onClick={() => run(p.id, pending.approve)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                        >
                          <CheckIcon className="size-3.5" /> {busy ? "…" : "Approve"}
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => run(p.id, pending.reject)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-600/10 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-600/20 disabled:opacity-50"
                        >
                          <XIcon className="size-3.5" /> Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </section>

      {/* Recent users */}
      <section className="overflow-hidden rounded-2xl border border-foreground/5 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/5 p-5">
          <div>
            <h2 className="font-heading text-base font-semibold">Recent Registered Users</h2>
            <p className="text-sm text-muted-foreground">Latest users registered on the platform.</p>
          </div>
          <Link
            to={PATHS.ADMIN_USERS}
            className="inline-flex items-center gap-1 rounded-lg border border-foreground/10 px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
          >
            View All Users <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Loading…</TableCell>
              </TableRow>
            )}
            {!users.loading && userRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No users yet.</TableCell>
              </TableRow>
            )}
            {!users.loading &&
              userRows.map((u) => {
                const acct = accountStatusTone(u.accountStatus);
                const initial = (u.displayName || u.email || "?").charAt(0).toUpperCase();
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                          {initial}
                        </span>
                        <span className="font-medium text-foreground">{u.displayName ?? "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ROLE_STYLES[u.role] ?? "bg-muted text-muted-foreground")}>
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground">{formatDate(u.createdAt)}</span>
                      <span className="block text-xs text-muted-foreground">{timeAgo(u.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", acct.badge)}>
                        {acct.label}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
