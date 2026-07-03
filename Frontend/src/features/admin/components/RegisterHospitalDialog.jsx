import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  HospitalIcon,
  MailIcon,
  LinkIcon,
  KeyRoundIcon,
  CopyIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from "lucide-react";
import { extractApiError } from "@/lib/helpers/helpers";

const EMPTY = { name: "", email: "", baseUrl: "", apiKey: "" };

function Field({ icon: Icon, label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Icon className="size-4 text-indigo-600" />
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10";

/**
 * Two-step dialog: (1) collect hospital details, (2) show the generated
 * hospitalId that the admin must send to the hospital to configure on their side.
 */
export default function RegisterHospitalDialog({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleOpenChange(next) {
    if (next) return;
    // Reset on close so the next open starts fresh.
    setForm(EMPTY);
    setError("");
    setCreated(null);
    setSubmitting(false);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await onCreate({
        name: form.name.trim(),
        email: form.email.trim(),
        baseUrl: form.baseUrl.trim(),
        apiKey: form.apiKey.trim(),
      });
      setCreated(result);
      toast.success(`${result.name} onboarded — ID ${result.hospitalId}`);
    } catch (err) {
      setError(extractApiError(err, "Could not register the hospital."));
    } finally {
      setSubmitting(false);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(created.hospitalId);
      toast.success("Hospital ID copied to clipboard");
    } catch {
      toast.error("Couldn't copy — please copy it manually.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2Icon className="size-5 text-emerald-500" />
                Hospital onboarded
              </DialogTitle>
              <DialogDescription>
                Share this ID with <span className="font-medium text-foreground">{created.name}</span>.
                They must configure it on their side to connect.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Generated Hospital ID
              </p>
              <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-indigo-700">
                {created.hospitalId}
              </p>
              <button
                onClick={copyId}
                className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
              >
                <CopyIcon className="size-3.5" /> Copy ID
              </button>
            </div>

            <dl className="divide-y divide-foreground/5 rounded-xl border border-foreground/5 px-3 text-sm">
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-muted-foreground">Contact email</dt>
                <dd className="truncate font-medium">{created.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-muted-foreground">Base URL</dt>
                <dd className="truncate font-medium">{created.baseUrl}</dd>
              </div>
            </dl>

            <button
              onClick={() => handleOpenChange(false)}
              className="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HospitalIcon className="size-5 text-indigo-600" />
                Register a hospital
              </DialogTitle>
              <DialogDescription>
                Connect a hospital to the verification directory. A unique Hospital ID is
                generated automatically.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field icon={HospitalIcon} label="Hospital name">
                <input
                  value={form.name}
                  onChange={set("name")}
                  required
                  placeholder="St Gabriel Hospital"
                  className={inputClass}
                />
              </Field>

              <Field icon={MailIcon} label="Contact email" hint="The generated ID will be sent here.">
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  placeholder="admin@stgabriel.com"
                  className={inputClass}
                />
              </Field>

              <Field icon={LinkIcon} label="Base URL" hint="The hospital's API endpoint used for verification.">
                <input
                  type="url"
                  value={form.baseUrl}
                  onChange={set("baseUrl")}
                  required
                  placeholder="https://api.stgabriel.com"
                  className={inputClass}
                />
              </Field>

              <Field icon={KeyRoundIcon} label="API key" hint="Optional — used to authenticate against the hospital.">
                <input
                  value={form.apiKey}
                  onChange={set("apiKey")}
                  placeholder="Optional"
                  className={inputClass}
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" /> Registering…
                  </>
                ) : (
                  "Register & generate ID"
                )}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
