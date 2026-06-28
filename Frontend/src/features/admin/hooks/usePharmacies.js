import { useCallback, useEffect, useState } from "react";
import * as adminApi from "@/features/admin/api/adminApi";
import { extractApiError } from "@/lib/helpers/helpers";

const PAGE_SIZE = 20;


export function usePharmacies({ initialStatus = "PENDING" } = {}) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({ totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function fetchPharmacies() {
      setLoading(true);
      setError("");
      try {
        const data = await adminApi.getPharmacies({ status, page, size: PAGE_SIZE });
        if (!active) return;
        setItems(data.content ?? []);
        setMeta({ totalElements: data.totalElements, totalPages: data.totalPages });
      } catch (e) {
        if (active) {
          setError(extractApiError(e, "Could not load pharmacies."));
          setItems([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchPharmacies();
    return () => {
      active = false;
    };
  }, [status, page, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);


  const changeStatus = useCallback((next) => {
    setStatus(next);
    setPage(0);
  }, []);

  const approve = useCallback(
    async (id) => {
      await adminApi.approvePharmacy(id);
      reload();
    },
    [reload]
  );

  const reject = useCallback(
    async (id) => {
      await adminApi.rejectPharmacy(id);
      reload();
    },
    [reload]
  );

  return { items, status, changeStatus, page, setPage, meta, loading, error, approve, reject, reload };
}

export default usePharmacies;
