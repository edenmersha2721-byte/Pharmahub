
export function medicineStockStatus(item) {
  const inStock = item?.available && item?.stockQuantity > 0;
  if (!inStock) {
    return { key: "out", label: "Out of Stock", hex: "#f43f5e", badge: "bg-rose-500/10 text-rose-600", dot: "bg-rose-500" };
  }
  if (item.stockQuantity <= 10) {
    return { key: "low", label: "Low Stock", hex: "#f59e0b", badge: "bg-amber-500/10 text-amber-600", dot: "bg-amber-500" };
  }
  return { key: "in", label: "In Stock", hex: "#10b981", badge: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500" };
}
