import { useEffect, useState } from "react";
import * as adminApi from "@/features/admin/api/adminApi";
import { extractApiError } from "@/lib/helpers/helpers";

const PAGE_SIZE = 20;


export function useUsers() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({ totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const data = await adminApi.getUsers({ page, size: PAGE_SIZE });
        if (!active) return;
        setItems(data.content ?? []);
        setMeta({ totalElements: data.totalElements, totalPages: data.totalPages });
      } catch (e) {
        if (active) {
          setError(extractApiError(e, "Could not load users."));
          setItems([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchUsers();
    return () => {
      active = false;
    };
  }, [page]);

  return { items, page, setPage, meta, loading, error };
}

export default useUsers;
