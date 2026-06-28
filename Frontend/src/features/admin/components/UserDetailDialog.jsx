import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MailIcon, CalendarDaysIcon, BadgeCheckIcon, XCircleIcon } from "lucide-react";
import { accountStatusTone } from "@/features/admin/api/adminApi";
import { formatDate } from "@/lib/helpers/helpers";
import { cn } from "@/lib/utils";

const ROLE_META = {
  CUSTOMER: { label: "Customer", badge: "bg-emerald-500/10 text-emerald-600" },
  PHARMACY: { label: "Pharmacy Owner", badge: "bg-indigo-500/10 text-indigo-600" },
  ADMIN: { label: "Admin", badge: "bg-violet-500/10 text-violet-600" },
};

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}


export default function UserDetailDialog({ user, onClose }) {
  const role = ROLE_META[user.role] ?? { label: user.role, badge: "bg-muted text-muted-foreground" };
  const acct = accountStatusTone(user.accountStatus);
  const handle = user.email ? `@${user.email.split("@")[0]}` : "";
  const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-base font-semibold text-white">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold text-foreground">
              {user.displayName ?? "—"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{handle}</p>
          </div>
          <span className={cn("ml-auto rounded-full px-2.5 py-1 text-xs font-medium", role.badge)}>
            {role.label}
          </span>
        </div>

        <div className="divide-y divide-foreground/5 rounded-xl border border-foreground/5 px-3">
          <Row icon={MailIcon} label="Email">{user.email}</Row>
          <Row icon={CalendarDaysIcon} label="Joined">{formatDate(user.createdAt)}</Row>
          <Row icon={user.emailVerified ? BadgeCheckIcon : XCircleIcon} label="Email verified">
            <span className={user.emailVerified ? "text-emerald-600" : "text-rose-600"}>
              {user.emailVerified ? "Verified" : "Not verified"}
            </span>
          </Row>
          <Row icon={ShieldDot} label="Status">
            <span className={cn("rounded-full px-2 py-0.5 text-xs", acct.badge)}>{acct.label}</span>
          </Row>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function ShieldDot(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
