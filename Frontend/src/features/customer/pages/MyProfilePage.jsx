import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  PencilIcon,
  CalendarIcon,
  CheckCircle2Icon,
  UserIcon,
  ShieldIcon,
  BarChart3Icon,
  ShoppingBagIcon,
  PillIcon,
  BookmarkIcon,
  HeartIcon,
  ClockIcon,
  HeadphonesIcon,
  MessageCircleIcon,
  LockIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import * as authApi from "@/features/auth/api/authApi";
import { parseApiError } from "@/lib/helpers/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getStoredDisplayName } from "@/lib/auth/profileStorage";
import { cn } from "@/lib/utils";

const PROFILE_FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email Address" },
  { key: "phone", label: "Phone Number" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "location", label: "Location" },
  { key: "accountType", label: "Account Type" },
  { key: "memberSince", label: "Member Since" },
];

const SUMMARY_STATS = [
  { label: "Orders", value: 0, icon: ShoppingBagIcon, tone: "from-indigo-500/15 to-indigo-500/5 text-indigo-600" },
  { label: "Prescriptions", value: 0, icon: PillIcon, tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-600" },
  { label: "Reservations", value: 0, icon: BookmarkIcon, tone: "from-amber-500/15 to-amber-500/5 text-amber-600" },
  { label: "Favorites", value: 0, icon: HeartIcon, tone: "from-rose-500/15 to-rose-500/5 text-rose-600" },
];

const ACTIVITY = [
  {
    title: "Account created",
    desc: "Welcome to PharmaHub!",
    date: "Jul 2, 2024",
    dot: "bg-indigo-500",
  },
  {
    title: "Profile updated",
    desc: "Your profile information was updated.",
    date: "Jul 2, 2024",
    dot: "bg-emerald-500",
  },
  {
    title: "Email verified",
    desc: "Your email address was verified.",
    date: "Jul 2, 2024",
    dot: "bg-rose-500",
  },
];

function initials(displayName, email) {
  const name = displayName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.split("@")[0].slice(0, 2).toUpperCase();
  return "U";
}

function buildProfile(jwtUser, apiProfile) {
  const email = apiProfile?.email ?? jwtUser?.email ?? "";
  const fullName =
    apiProfile?.displayName?.trim() ||
    jwtUser?.displayName?.trim() ||
    getStoredDisplayName(email) ||
    "—";
  const role = apiProfile?.role ?? jwtUser?.role ?? "CUSTOMER";
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  return {
    fullName,
    email,
    phone: "+251 912 345 678",
    dateOfBirth: "March 12, 2000",
    gender: "Female",
    location: "Addis Ababa, Ethiopia",
    accountType: displayRole,
    memberSince: "July 2, 2024",
    joinedLabel: "Joined July 2, 2024",
    verified: apiProfile?.emailVerified ?? false,
  };
}

function InfoField({ label, value }) {
  return (
    <div className="rounded-xl border border-foreground/5 bg-muted/30 px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function MyProfilePage() {
  const { user } = useAuth();
  const [apiProfile, setApiProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const profile = buildProfile(user, apiProfile);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordSending, setPasswordSending] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    let active = true;
    authApi
      .getCurrentUser()
      .then((data) => {
        if (active) setApiProfile(data);
      })
      .catch((err) => {
        if (!active) return;
        const storedName = getStoredDisplayName(user?.email);
        const hasNameFallback = Boolean(user?.displayName?.trim() || storedName);
        if (!hasNameFallback) {
          const { message } = parseApiError(err, "Could not load your profile.");
          toast.error(message);
        }
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const notifySoon = (action) => () => toast(`${action} — coming soon.`);

  const openPasswordDialog = () => {
    setPasswordSent(false);
    setPasswordError("");
    setPasswordDialogOpen(true);
  };

  const handleSendResetLink = async () => {
    setPasswordSending(true);
    setPasswordError("");
    try {
      await authApi.forgotPassword(profile.email.trim());
      setPasswordSent(true);
    } catch (err) {
      const { message } = parseApiError(err, "Could not send the reset link. Please try again.");
      setPasswordError(message);
    } finally {
      setPasswordSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Profile hero card */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-indigo-500/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0 self-start">
              <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-600/25 sm:size-24 sm:text-3xl">
                {profileLoading ? (
                  <Skeleton className="size-10 rounded-full bg-white/20" />
                ) : (
                  initials(profile.fullName, profile.email)
                )}
              </span>
              <button
                type="button"
                onClick={notifySoon("Avatar edit")}
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-background text-indigo-600 shadow-md transition-colors hover:bg-indigo-50"
                aria-label="Edit avatar"
              >
                <PencilIcon className="size-3.5" />
              </button>
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {profileLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                    {profile.fullName}
                  </h2>
                )}
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {profile.accountType}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{profile.email}</span>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2Icon className="size-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground">{profile.phone}</p>

              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarIcon className="size-4 text-indigo-500" />
                {profile.joinedLabel}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="h-10 shrink-0 gap-2 border-indigo-500/30 bg-background px-4 text-indigo-700 hover:bg-indigo-500/5 hover:text-indigo-800"
            onClick={notifySoon("Edit profile")}
          >
            <PencilIcon className="size-4" />
            Edit Profile
          </Button>
        </div>
      </section>

      {/* Two-column content */}
      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <Card className="rounded-2xl border-foreground/5 shadow-sm">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                  <UserIcon className="size-4" />
                </span>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {PROFILE_FIELDS.map(({ key, label }) => (
                  <InfoField
                    key={key}
                    label={label}
                    value={profileLoading && key === "fullName" ? "…" : profile[key]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-foreground/5 shadow-sm">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
                <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
                  <ShieldIcon className="size-4" />
                </span>
                Security
              </CardTitle>
              <p className="text-sm text-muted-foreground">Manage your account security.</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-4 rounded-xl border border-foreground/5 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Password</p>
                  <p className="mt-1 tracking-widest text-muted-foreground">••••••••••••</p>
                </div>
                <Button
                  variant="outline"
                  className="h-9 gap-2 border-indigo-500/30 text-indigo-700 hover:bg-indigo-500/5"
                  onClick={openPasswordDialog}
                >
                  <LockIcon className="size-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <Card className="rounded-2xl border-foreground/5 shadow-sm">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
                <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600">
                  <BarChart3Icon className="size-4" />
                </span>
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {SUMMARY_STATS.map(({ label, value, icon: Icon, tone }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-xl border border-foreground/5 bg-background px-3 py-4 text-center"
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                        tone
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-foreground/5 shadow-sm">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <ClockIcon className="size-4" />
                </span>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-5">
                {ACTIVITY.map((item, i) => (
                  <li key={item.title} className="relative flex gap-3 pl-1">
                    {i < ACTIVITY.length - 1 && (
                      <span
                        className="absolute left-[7px] top-5 h-[calc(100%+4px)] w-px bg-foreground/10"
                        aria-hidden
                      />
                    )}
                    <span className={cn("relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full", item.dot)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <section className="rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-background p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600">
                <MessageCircleIcon className="size-4" />
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-sm font-semibold text-foreground">Need Help?</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contact our support team if you need assistance.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 h-10 w-full gap-2 border-indigo-500/20 bg-background text-indigo-700 hover:bg-indigo-500/5"
              onClick={notifySoon("Contact support")}
            >
              <HeadphonesIcon className="size-4" />
              Contact Support
            </Button>
          </section>
        </div>
      </div>

      <Dialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            setPasswordSent(false);
            setPasswordError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              {passwordSent
                ? "Follow the link in your email to set a new password."
                : "We'll send a secure reset link to your account email."}
            </DialogDescription>
          </DialogHeader>

          {passwordSent ? (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-3 text-sm text-foreground">
              If an account exists for{" "}
              <span className="font-medium">{profile.email}</span>, a password reset link has been
              sent. Check your inbox (and spam), then open the link to choose a new password.
            </p>
          ) : (
            <div className="rounded-lg border border-foreground/10 bg-muted/30 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Reset link will be sent to</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{profile.email}</p>
            </div>
          )}

          {passwordError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {passwordError}
            </p>
          )}

          <DialogFooter>
            {passwordSent ? (
              <Button className="w-full sm:w-auto" onClick={() => setPasswordDialogOpen(false)}>
                Done
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="gap-2"
                  disabled={passwordSending}
                  onClick={handleSendResetLink}
                >
                  <LockIcon className="size-4" />
                  {passwordSending ? "Sending…" : "Send reset link"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
