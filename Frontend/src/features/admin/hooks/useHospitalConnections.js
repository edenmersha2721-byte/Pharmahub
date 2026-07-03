import { useCallback, useEffect, useState } from "react";
import * as adminApi from "@/features/admin/api/adminApi";
import { extractApiError } from "@/lib/helpers/helpers";

/**
 * Loads the admin's onboarded hospital connections and exposes a `create`
 * action that returns the created connection (including the generated
 * hospitalId) so the caller can surface it to the admin.
 */
export function useHospitalConnections() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await adminApi.getHospitalConnections();
        if (active) setItems(data);
      } catch (e) {
        if (active) {
          setError(extractApiError(e, "Could not load hospital connections."));
          setItems([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const create = useCallback(async (payload) => {
    const created = await adminApi.createHospitalConnection(payload);
    setReloadKey((k) => k + 1);
    return created;
  }, []);

  return { items, loading, error, create, reload };
}

export default useHospitalConnections;
