import { useCallback, useState } from "react";
import * as searchApi from "@/features/customer/api/searchApi";
import { extractApiError } from "@/lib/helpers/helpers";

const EMPTY_META = { page: 0, totalPages: 0, totalElements: 0, last: true };


export function useMedicines() {
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [lastParams, setLastParams] = useState(null);

  const run = useCallback(async (params, { append } = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchApi.searchMedicines(params);
      setResults((prev) => (append ? [...prev, ...data.content] : data.content));
      setMeta({
        page: data.page,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        last: data.last,
      });
      setLastParams(params);
      setHasSearched(true);
    } catch (e) {
      setError(extractApiError(e, "Search failed. Please try again."));
      if (!append) {
        setResults([]);
        setMeta(EMPTY_META);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback((params) => run({ ...params, page: 0 }), [run]);

  const loadMore = useCallback(() => {
    if (!lastParams || meta.last || loading) return;
    run({ ...lastParams, page: meta.page + 1 }, { append: true });
  }, [lastParams, meta, loading, run]);

  return { results, meta, loading, error, hasSearched, search, loadMore };
}

export default useMedicines;
