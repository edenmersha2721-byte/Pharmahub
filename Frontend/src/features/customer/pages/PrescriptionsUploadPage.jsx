import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  UploadCloudIcon,
  FileTextIcon,
  LoaderIcon,
  MapPinIcon,
  PillIcon,
  PackageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGeolocation } from "@/features/customer/hooks/useGeolocation";
import { usePrescriptionUpload } from "@/features/customer/hooks/usePrescriptionUpload";
import PharmacyResultsView from "@/features/customer/components/PharmacyResultsView";
import ResultCardSkeleton from "@/features/customer/components/ResultCardSkeleton";
import EmptyState from "@/features/customer/components/EmptyState";
import { ACCEPTED_FILE_TYPES, ACCEPT_ATTR } from "@/features/customer/api/prescriptionApi";

const RADIUS_OPTIONS = [1, 2, 5, 10, 25, 50];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function PrescriptionsUploadPage() {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const geo = useGeolocation();
  const { status, progress, error, extractedMedicines, results, message, upload, reset } =
    usePrescriptionUpload();

  const isUploading = status === "uploading";
  const isDone = status === "done";

  const previewUrl = useMemo(
    () => (file && file.type !== "application/pdf" ? URL.createObjectURL(file) : ""),
    [file]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (status === "done") toast.success(message || "Prescription processed");
    if (status === "error" && error) toast.error(error);
  }, [status, message, error]);

  useEffect(() => {
    if (geo.error) toast.error(geo.error);
  }, [geo.error]);

  const selectFile = (picked) => {
    if (!picked) return;
    if (!ACCEPTED_FILE_TYPES.includes(picked.type)) {
      setFileError("Unsupported file type. Upload a JPG, PNG, or PDF.");
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setFileError("File is too large (max 10 MB).");
      return;
    }
    setFileError("");
    setFile(picked);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setFileError("Choose a prescription file first.");
      return;
    }
    const coords = geo.coords ?? (await geo.request());
    upload({
      file,
      lat: coords?.lat,
      lng: coords?.lng,
      radiusKm: coords ? radiusKm : undefined,
    });
  };

  const startOver = () => {
    reset();
    setFile(null);
    setFileError("");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <FileTextIcon className="size-3.5" />
          Prescription scan
        </span>
        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Upload a prescription
        </h1>
        <p className="text-sm text-muted-foreground">
          We read the medicines from your prescription and find nearby pharmacies that stock them.
        </p>
      </div>

      {!isDone && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Dropzone */}
          <div className="flex flex-col gap-3">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className={cn(
                "flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
                dragging
                  ? "border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10"
                  : "border-foreground/15 bg-card hover:border-indigo-400/60 hover:bg-muted/30"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_ATTR}
                className="hidden"
                onChange={(e) => selectFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Prescription preview"
                      className="max-h-52 rounded-xl object-contain ring-1 ring-foreground/10"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                      <FileTextIcon className="size-7" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">Click to choose a different file</p>
                </div>
              ) : (
                <>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 ring-1 ring-indigo-500/20">
                    <UploadCloudIcon className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Drag &amp; drop, or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF · up to 10 MB</p>
                  </div>
                </>
              )}
            </div>
            {fileError && <p className="text-sm font-medium text-destructive">{fileError}</p>}
          </div>

          {/* Side panel: location + action */}
          <div className="flex flex-col gap-4 rounded-2xl border border-foreground/5 bg-card p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Search radius</p>
              <p className="text-xs text-muted-foreground">
                We use your location automatically when you search to sort pharmacies by distance.
              </p>
            </div>

            <label className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-foreground/10 bg-background px-3 text-sm text-muted-foreground">
              <MapPinIcon className="size-4 text-indigo-600" />
              Within
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="bg-transparent font-medium text-foreground outline-none"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} km
                  </option>
                ))}
              </select>
            </label>

            {geo.coords && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Using your location
              </span>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || isUploading || geo.loading}
              className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60"
            >
              {geo.loading ? (
                "Getting location…"
              ) : isUploading ? (
                <>
                  <LoaderIcon className="size-5 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <UploadCloudIcon className="size-5" /> Find medicines
                </>
              )}
            </button>

            {isUploading && (
              <div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all"
                    style={{ width: `${progress || 8}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {progress < 100 ? `Uploading ${progress}%` : "Reading prescription…"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Processing skeletons */}
      {isUploading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {isDone && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold">Extracted medicines</h2>
            <button
              onClick={startOver}
              className="inline-flex items-center gap-2 rounded-xl border border-foreground/10 bg-background px-4 py-2 text-sm font-medium transition-all hover:border-indigo-500/40 hover:text-indigo-700"
            >
              <UploadCloudIcon className="size-4" />
              Upload another
            </button>
          </div>

          {extractedMedicines.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {extractedMedicines.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-3 py-1.5 text-sm font-medium text-foreground ring-1 ring-indigo-500/20"
                >
                  <PillIcon className="size-3.5 text-indigo-600" />
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileTextIcon}
              title="No medicines detected"
              subtitle={message || "We couldn't read any medicine names from this prescription. Try a clearer photo."}
            />
          )}

          {results.length > 0 ? (
            <PharmacyResultsView
              results={results}
              userCoords={geo.coords}
              header={
                <h3 className="font-heading text-base font-semibold">
                  Pharmacies with your medicines
                </h3>
              }
            />
          ) : (
            extractedMedicines.length > 0 && (
              <EmptyState
                icon={PackageIcon}
                title="No nearby stock found"
                subtitle={
                  geo.coords
                    ? "None of the nearby pharmacies have these in stock within your radius."
                    : "No pharmacies found with these medicines. Share your location to broaden the search."
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
