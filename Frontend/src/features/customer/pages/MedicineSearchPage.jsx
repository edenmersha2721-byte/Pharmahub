import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  SearchIcon,
  XIcon,
  MapPinIcon,
  CrosshairIcon,
  LoaderIcon,
  PackageIcon,
  NavigationIcon,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance, googleMapsDirectionsUrl } from "@/lib/helpers/helpers";
import { useMedicines } from "@/features/customer/hooks/useMedicines";
import { useGeolocation } from "@/features/customer/hooks/useGeolocation";
import { medicineStockStatus } from "@/features/customer/stock";
import PharmacyListItem from "@/features/customer/components/PharmacyListItem";
import PharmacyMap from "@/features/customer/components/PharmacyMap";
import ResultCardSkeleton from "@/features/customer/components/ResultCardSkeleton";
import EmptyState from "@/features/customer/components/EmptyState";

const RADIUS_OPTIONS = [1, 2, 5, 10, 25, 50];
const STOCK = [
  { key: "all", label: "All" },
  { key: "in", label: "In Stock" },
  { key: "low", label: "Low Stock" },
];

const pillSelect =
  "h-9 cursor-pointer rounded-full border border-foreground/10 bg-background pl-3 pr-2 text-sm font-medium text-foreground outline-none transition-colors hover:border-indigo-500/40 focus-visible:border-indigo-500/60";

export default function MedicineSearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [radiusKm, setRadiusKm] = useState(5);
  const [queryError, setQueryError] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const geo = useGeolocation();
  const { results, meta, loading, error, hasSearched, search, loadMore } = useMedicines();

  useEffect(() => {
    if (!initialQuery.trim()) return;
    const id = setTimeout(() => {
      setQuery(initialQuery.trim());
      search({ query: initialQuery.trim(), size: 20 });
    }, 0);
    return () => clearTimeout(id);
  }, [initialQuery, search]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  useEffect(() => {
    if (geo.error) toast.error(geo.error);
  }, [geo.error]);

  // Stock filter over the loaded results. Order stays as the backend returned
  // it (nearest first) — no client-side re-sorting.
  const displayed = useMemo(
    () => results.filter((r) => stockFilter === "all" || medicineStockStatus(r).key === stockFilter),
    [results, stockFilter]
  );

  // One pin per pharmacy for the map.
  const pharmacies = useMemo(() => {
    const byId = new Map();
    for (const r of displayed) if (!byId.has(r.pharmacyId)) byId.set(r.pharmacyId, r);
    return [...byId.values()];
  }, [displayed]);

  const selected = useMemo(
    () => pharmacies.find((p) => p.pharmacyId === selectedId) ?? pharmacies[0] ?? null,
    [pharmacies, selectedId]
  );

  // On search we auto-capture location (best-effort): reuse coords we already
  // have, otherwise prompt once. The user's only explicit choice is the radius.
  // If location is denied, we still search (just without distance/radius).
  const runSearch = async (q) => {
    const coords = geo.coords ?? (await geo.request());
    search({
      query: q,
      lat: coords?.lat,
      lng: coords?.lng,
      radiusKm: coords ? radiusKm : undefined,
      size: 20,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setQueryError("Enter a medicine name to search.");
      return;
    }
    setQueryError("");
    setSelectedId(null);
    runSearch(query.trim());
  };

  const showResults = results.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Search Medicine</h1>
        <p className="text-sm text-muted-foreground">Find the medicine you need from nearby pharmacies.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setQueryError("");
            }}
            placeholder="Search medicine, e.g. Paracetamol 650mg"
            className={cn(
              "h-12 w-full rounded-xl border bg-background pl-12 pr-10 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground",
              queryError
                ? "border-destructive"
                : "border-foreground/10 focus:border-indigo-500/60 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/15"
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || geo.loading}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60"
        >
          {(geo.loading || loading) && <LoaderIcon className="size-5 animate-spin" />}
          {geo.loading ? "Locating…" : loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Filter row — distance is the user's choice; location is automatic on search */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/10 bg-background pl-3 pr-2 text-sm font-medium">
          <MapPinIcon className="size-4 text-indigo-600" />
          Within
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="cursor-pointer bg-transparent outline-none"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r} km
              </option>
            ))}
          </select>
        </span>

        <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/10 bg-muted/40 px-3 text-sm font-medium text-muted-foreground">
          <NavigationIcon className="size-4 text-indigo-600" />
          Sorted by Nearest
        </span>

        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className={pillSelect}>
          {STOCK.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Location status (captured automatically when you search) */}
        {geo.coords ? (
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 text-sm font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Using your location
          </span>
        ) : geo.loading ? (
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/10 px-3 text-sm text-muted-foreground">
            <LoaderIcon className="size-4 animate-spin" />
            Locating…
          </span>
        ) : hasSearched ? (
          <button
            type="button"
            onClick={geo.request}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/10 px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-indigo-700"
          >
            <CrosshairIcon className="size-4" />
            Location off · enable
          </button>
        ) : (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            We&apos;ll use your location when you search.
          </span>
        )}
      </div>

      {/* States */}
      {loading && results.length === 0 && (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!hasSearched && !loading && (
        <EmptyState
          icon={SearchIcon}
          title="Start your search"
          subtitle="Type a medicine name above and we'll find nearby pharmacies that have it in stock."
        />
      )}

      {hasSearched && !loading && results.length === 0 && !error && (
        <EmptyState
          icon={PackageIcon}
          title={`No matches for “${query}”`}
          subtitle={geo.coords ? "Try a different spelling or widen your radius." : "Try a different spelling, or share your location."}
        />
      )}

      {/* Results: list + map */}
      {showResults && (
        <>
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium text-foreground">
              {pharmacies.length} pharmac{pharmacies.length === 1 ? "y" : "ies"} found
            </p>
            {geo.coords && (
              <p className="text-muted-foreground">Showing results within {radiusKm} km</p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            {/* List */}
            <div className="flex flex-col gap-3">
              {displayed.map((item, i) => (
                <PharmacyListItem
                  key={`${item.medicineId}-${item.pharmacyId}`}
                  item={item}
                  userCoords={geo.coords}
                  active={item.pharmacyId === (selected?.pharmacyId ?? null)}
                  nearest={i === 0 && !!geo.coords && item.distanceMeters != null}
                  onSelect={() => setSelectedId(item.pharmacyId)}
                />
              ))}
              {!meta.last && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="mx-auto mt-1 inline-flex items-center gap-2 rounded-xl border border-foreground/10 bg-background px-5 py-2.5 text-sm font-medium transition-all hover:border-indigo-500/40 hover:text-indigo-700 disabled:opacity-60"
                >
                  {loading && <LoaderIcon className="size-4 animate-spin" />}
                  Load More
                </button>
              )}
            </div>

            {/* Map panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-foreground/5 bg-card">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <p className="text-sm font-semibold">Nearby Pharmacies</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> In Stock</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" /> Low</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-rose-500" /> Out</span>
                  </div>
                </div>
                <div className="h-[360px] w-full">
                  <PharmacyMap
                    userCoords={geo.coords}
                    pharmacies={pharmacies}
                    selected={selected}
                    radiusKm={geo.coords ? radiusKm : undefined}
                  />
                </div>

                {/* Selected pharmacy card */}
                {selected && (
                  <a
                    href={googleMapsDirectionsUrl(selected.latitude, selected.longitude, geo.coords?.lat, geo.coords?.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 border-t border-foreground/5 p-4 transition-colors hover:bg-muted/40"
                  >
                    <span className={cn("flex size-11 items-center justify-center rounded-2xl", medicineStockStatus(selected).badge)}>
                      <NavigationIcon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{selected.pharmacyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {geo.coords && selected.distanceMeters != null
                          ? `${formatDistance(selected.distanceMeters)} away · `
                          : ""}
                        Tap for directions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {selected.price != null ? `ETB ${Number(selected.price).toFixed(2)}` : "—"}
                      </p>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium", medicineStockStatus(selected).badge)}>
                        <span className={cn("size-1.5 rounded-full", medicineStockStatus(selected).dot)} />
                        {medicineStockStatus(selected).label}
                      </span>
                    </div>
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
