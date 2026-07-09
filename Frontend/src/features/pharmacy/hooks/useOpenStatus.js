import { useCallback, useState } from "react";
import { toast } from "sonner";
import { setPharmacyOpenStatus } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { extractApiError } from "@/lib/helpers/helpers";

/**
 * Manages the pharmacy's open/closed state.
 *
 * The backend only exposes a PATCH to set the status (no GET for the current
 * value yet), so we remember the last-known state per pharmacy in localStorage
 * and default to "open". Every toggle reconciles with the value the API returns.
 */
const storageKey = (id) => `pharmacy-open:${id ?? "me"}`;

export function useOpenStatus() {
  const { user } = useAuth();
  const key = storageKey(user?.userId);

  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved === null ? true : saved === "true";
  });
  const [saving, setSaving] = useState(false);

  const toggle = useCallback(async () => {
    const next = !open;
    setSaving(true);
    setOpen(next); // optimistic
    try {
      const res = await setPharmacyOpenStatus(next);
      setOpen(res.open);
      localStorage.setItem(key, String(res.open));
      toast.success(res.message ?? (res.open ? "You are now open." : "You are now closed."));
    } catch (e) {
      setOpen(!next); // revert
      toast.error(extractApiError(e, "Could not update your open status."));
    } finally {
      setSaving(false);
    }
  }, [open, key]);

  return { open, saving, toggle };
}

export default useOpenStatus;
