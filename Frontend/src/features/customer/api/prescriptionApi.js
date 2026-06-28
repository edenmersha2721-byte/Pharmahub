import axiosInstance from "@/lib/axios/axiosInstance";


export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
export const ACCEPT_ATTR = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf";


export async function uploadPrescription(
  { file, lat, lng, radiusKm },
  { onUploadProgress } = {}
) {
  const formData = new FormData();
  formData.append("file", file);
  if (lat != null && lng != null) {
    formData.append("latitude", lat);
    formData.append("longitude", lng);
    if (radiusKm != null) formData.append("radiusKm", radiusKm);
  }

  const { data } = await axiosInstance.post("/prescriptions/upload", formData, {
    // Let axios/browser set the multipart boundary for FormData.
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return data;
}
