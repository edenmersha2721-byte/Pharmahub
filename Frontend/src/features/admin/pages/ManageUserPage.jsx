import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
  UsersIcon,
  UserIcon,
  Building2Icon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  EyeIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";
import { useUsers } from "@/features/admin/hooks/useUsers";
import { accountStatusTone } from "@/features/admin/api/adminApi";
import UserDetailDialog from "@/features/admin/components/UserDetailDialog";
import { formatDate, timeAgo } from "@/lib/helpers/helpers";
import { cn } from "@/lib/utils";

const ROLE_META = {
  CUSTOMER: { label: "Customer", badge: "bg-emerald-500/10 text-emerald-600" },
  PHARMACY: { label: "Pharmacy Owner", badge: "bg-indigo-500/10 text-indigo-600" },
  ADMIN: { label: "Admin", badge: "bg-violet-500/10 text-violet-600" },
};

const STATUS_DOT = { ACTIVE: "bg-emerald-500", PENDING: "bg-amber-500", LOCKED: "bg-rose-500" };

const ROLE_FILTERS = [
  { key: "ALL", label: "All" },
  { key: "CUSTOMER", label: "Customers" },
  { key: "PHARMACY", label: "Pharmacies" },
  { key: "ADMIN", label: "Admins" },
];

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

export default function ManageUserPage() {
  const { stats, statsLoading } = useOutletContext();
  const { items, page, setPage, meta, loading, error } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [viewing, setViewing] = useState(null);

  const num = (v) => (statsLoading ? "…" : v);
  const customers = Math.max(0, (stats.totalUsers || 0) - (stats.totalPharmacies || 0));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((u) => {
      const matchesQuery =
        !q ||
        [u.displayName, u.email].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [items, search, roleFilter]);

  const totalPages = meta.totalPages || 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Manage all registered users on the platform.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UsersIcon} label="Total Users" value={num(stats.totalUsers)} tone="bg-indigo-500/10 text-indigo-600" hint="on the platform" />
        <StatCard icon={UserIcon} label="Customers" value={num(customers)} tone="bg-emerald-500/10 text-emerald-600" hint="≈ total − pharmacies" />
        <StatCard icon={Building2Icon} label="Pharmacy Owners" value={num(stats.totalPharmacies)} tone="bg-violet-500/10 text-violet-600" hint="registered pharmacies" />
        <StatCard icon={ClockIcon} label="Pending Approvals" value={num(stats.pending)} tone="bg-amber-500/10 text-amber-600" hint="pharmacies to review" />
      </div>

      {/* All users card */}
      <section className="overflow-hidden rounded-2xl border border-foreground/5 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/5 p-5">
          <div>
            <h2 className="font-heading text-base font-semibold">All Users</h2>
            <p className="text-sm text-muted-foreground">Manage all registered users on the platform.</p>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="relative min-w-48 flex-1 sm:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users on this page…"
                className="h-9 w-full rounded-xl border border-foreground/10 bg-background pl-9 pr-3 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10"
              />
            </div>
            <button
              onClick={() => toast("Creating users from admin is coming soon.")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
            >
              <PlusIcon className="size-4" /> Add User
            </button>
          </div>
        </div>

        {/* Role filter */}
        <div className="flex flex-wrap items-center gap-1 border-b border-foreground/5 px-5 py-3">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setRoleFilter(f.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                roleFilter === f.key
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="m-5 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">Loading users…</TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No users match this view.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((u) => {
                const role = ROLE_META[u.role] ?? { label: u.role, badge: "bg-muted text-muted-foreground" };
                const acct = accountStatusTone(u.accountStatus);
                const initial = (u.displayName || u.email || "?").charAt(0).toUpperCase();
                const handle = u.email ? `@${u.email.split("@")[0]}` : "";
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                          {initial}
                        </span>
                        <div className="min-w-0">
                          <span className="block font-medium text-foreground">{u.displayName ?? "—"}</span>
                          <span className="block text-xs text-muted-foreground">{handle}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", role.badge)}>
                        {role.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground">{formatDate(u.createdAt)}</span>
                      <span className="block text-xs text-muted-foreground">{timeAgo(u.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span className={cn("size-1.5 rounded-full", STATUS_DOT[u.accountStatus] ?? "bg-muted-foreground")} />
                        {acct.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.emailVerified ? (
                        <CheckCircle2Icon className="size-5 text-emerald-500" />
                      ) : (
                        <XCircleIcon className="size-5 text-rose-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => setViewing(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-foreground/10 px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
                      >
                        <EyeIcon className="size-3.5" /> View
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-foreground/5 p-4">
            <p className="text-xs text-muted-foreground">
              Page {page + 1} of {totalPages} · {meta.totalElements} users
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0 || loading}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1 || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {viewing && <UserDetailDialog user={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
