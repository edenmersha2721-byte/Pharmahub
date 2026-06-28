import { useMemo, useState } from "react";
import MedicineResultCard from "@/features/customer/components/MedicineResultCard";
import PharmacyMap from "@/features/customer/components/PharmacyMap";


export default function PharmacyResultsView({ results, userCoords, header, footer }) {
  const [selectedId, setSelectedId] = useState(null);

  
  const pharmacies = useMemo(() => {
    const byId = new Map();
    for (const r of results) {
      if (!byId.has(r.pharmacyId)) byId.set(r.pharmacyId, r);
    }
    return [...byId.values()];
  }, [results]);

  const selected = useMemo(
    () => pharmacies.find((p) => p.pharmacyId === selectedId) ?? null,
    [pharmacies, selectedId]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="order-2 flex flex-col gap-4 lg:order-1">
        {header}
        <div className="grid content-start gap-4 sm:grid-cols-2">
          {results.map((item) => (
            <MedicineResultCard
              key={`${item.medicineId}-${item.pharmacyId}`}
              item={item}
              userCoords={userCoords}
              active={item.pharmacyId === selectedId}
              onSelect={() => setSelectedId(item.pharmacyId)}
            />
          ))}
        </div>
        {footer}
      </div>

      <div className="order-1 h-72 overflow-hidden rounded-2xl border border-foreground/5 shadow-sm lg:order-2 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <PharmacyMap userCoords={userCoords} pharmacies={pharmacies} selected={selected} />
      </div>
    </div>
  );
}
