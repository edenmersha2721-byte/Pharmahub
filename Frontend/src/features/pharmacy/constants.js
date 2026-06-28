export function getStockStatus(stock) {
  if (!stock || stock <= 0)
    return { key: "out", label: "Out of Stock", dot: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-500/10" };
  if (stock <= 10)
    return { key: "low", label: "Low Stock", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10" };
  return { key: "in", label: "In Stock", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10" };
}

export const MEDICINE_CATEGORIES = [
  "ANALGESIC",
  "ANTIBIOTIC",
  "ANTIVIRAL",
  "ANTIFUNGAL",
  "ANTIHISTAMINE",
  "ANTIHYPERTENSIVE",
  "ANTIDIABETIC",
  "CARDIOVASCULAR",
  "DERMATOLOGICAL",
  "GASTROINTESTINAL",
  "HORMONAL",
  "NEUROLOGICAL",
  "ONCOLOGICAL",
  "OPHTHALMOLOGICAL",
  "PSYCHIATRIC",
  "RESPIRATORY",
  "SUPPLEMENT",
  "VACCINE",
  "OTHER",
];
