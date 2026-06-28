import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormField from "@/features/auth/components/FormField";
import { MEDICINE_CATEGORIES } from "@/features/pharmacy/constants";
import { extractApiError } from "@/lib/helpers/helpers";

function toForm(m) {
  return {
    medicineName: m?.medicineName ?? "",
    genericName: m?.genericName ?? "",
    brandName: m?.brandName ?? "",
    category: m?.category ?? "",
    description: m?.description ?? "",
    price: m?.price != null ? String(m.price) : "",
    stockQuantity: m?.stockQuantity != null ? String(m.stockQuantity) : "0",
    requiresPrescription: m?.requiresPrescription ?? false,
    expiryDate: m?.expiryDate ?? "", // backend LocalDate -> "yyyy-MM-dd"
  };
}

const fieldClass = "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Add / edit medicine dialog. Mount it freshly per target (parent keys it) so
 * the form seeds from `initialValue` without effect-driven resets.
 *
 * @param initialValue  medicine to edit, or null to add
 * @param onSubmit      (payload) => Promise  — resolves on success, rejects with API error
 * @param onClose       () => void
 */
export default function MedicineFormDialog({ initialValue, onSubmit, onClose }) {
  const isEdit = !!initialValue;
  const [form, setForm] = useState(() => toForm(initialValue));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.medicineName.trim()) next.medicineName = "Medicine name is required";
    else if (form.medicineName.trim().length > 255) next.medicineName = "Max 255 characters";

    if (form.price === "" || form.price == null) next.price = "Price is required";
    else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      next.price = "Price must be 0 or more";

    if (Number.isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0)
      next.stockQuantity = "Stock must be 0 or more";
    else if (!Number.isInteger(Number(form.stockQuantity)))
      next.stockQuantity = "Stock must be a whole number";

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    const payload = {
      medicineName: form.medicineName.trim(),
      genericName: form.genericName.trim() || null,
      brandName: form.brandName.trim() || null,
      category: form.category || null,
      description: form.description.trim() || null,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      requiresPrescription: form.requiresPrescription,
      expiryDate: form.expiryDate || null,
    };

    setSubmitting(true);
    setServerError("");
    try {
      await onSubmit(payload);
      onClose(); // success: parent unmounts the dialog
    } catch (err) {
      setServerError(extractApiError(err, "Could not save the medicine. Please try again."));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit medicine" : "Add medicine"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details and stock for this medicine." : "Add a new medicine to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <form id="medicine-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField
            id="medicineName"
            label="Medicine name"
            value={form.medicineName}
            onChange={set("medicineName")}
            error={errors.medicineName}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="genericName"
              label="Generic name"
              value={form.genericName}
              onChange={set("genericName")}
            />
            <FormField
              id="brandName"
              label="Brand name"
              value={form.brandName}
              onChange={set("brandName")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={set("category")}
                className={fieldClass}
              >
                <option value="">— Select —</option>
                {MEDICINE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              id="expiryDate"
              label="Expiry date"
              type="date"
              value={form.expiryDate}
              onChange={set("expiryDate")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="price"
              label="Price (ETB)"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={set("price")}
              error={errors.price}
            />
            <FormField
              id="stockQuantity"
              label="Stock quantity"
              type="number"
              min="0"
              step="1"
              value={form.stockQuantity}
              onChange={set("stockQuantity")}
              error={errors.stockQuantity}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              value={form.description}
              onChange={set("description")}
              className={`${fieldClass} h-auto py-2`}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.requiresPrescription}
              onChange={set("requiresPrescription")}
              className="size-4 rounded border-input"
            />
            Requires prescription
          </label>

          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="medicine-form" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Add medicine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
