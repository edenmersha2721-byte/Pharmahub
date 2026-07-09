import { useEffect, useState } from "react";
import * as authApi from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getStoredDisplayName, saveProfileHint } from "@/lib/auth/profileStorage";

/**
 * Resolves the current user's display name (pharmacy name / customer name) for
 * greetings. Prefers the JWT claim, then a cached hint, then falls back to
 * fetching /auth/me. Returns "" until something resolves.
 */
export function useDisplayName() {
  const { user } = useAuth();
  const [name, setName] = useState(
    () => user?.displayName?.trim() || getStoredDisplayName(user?.email) || ""
  );

  useEffect(() => {
    if (name) return; // already known from the JWT or cache
    let active = true;
    authApi
      .getCurrentUser()
      .then((data) => {
        const dn = data?.displayName?.trim();
        if (active && dn) {
          setName(dn);
          saveProfileHint(user?.email, { displayName: dn });
        }
      })
      .catch(() => {
        /* keep falling back to email in the UI */
      });
    return () => {
      active = false;
    };
  }, [name, user?.email]);

  return name;
}

export default useDisplayName;
