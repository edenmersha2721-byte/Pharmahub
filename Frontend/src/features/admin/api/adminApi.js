import axiosInstance from "@/lib/axios/axiosInstance";


/** @param status one of PENDING | APPROVED | REJECTED, or null for all */
export async function getPharmacies({ status = null, page = 0, size = 20 } = {}) {
  const params = { page, size };
  if (status) params.status = status;
  const { data } = await axiosInstance.get("/admin/pharmacies", { params });
  return data; 
  
}

export async function getPharmacyById(id) {
  const { data } = await axiosInstance.get(`/admin/pharmacies/${id}`);
  return data;
}

export async function approvePharmacy(id) {
  const { data } = await axiosInstance.post(`/admin/pharmacies/${id}/approve`);
  return data;
}

export async function rejectPharmacy(id) {
  const { data } = await axiosInstance.post(`/admin/pharmacies/${id}/reject`);
  return data;
}

export async function getUsers({ page = 0, size = 20 } = {}) {
  const { data } = await axiosInstance.get("/admin/users", { params: { page, size } });
  return data; 
}


// --- Hospital connections (integrated hospitals / verification directory) ----

/**
 * List all onboarded hospital connections.
 * @returns array of { id, name, email, hospitalId, baseUrl, active }
 */
export async function getHospitalConnections() {
  const { data } = await axiosInstance.get("/hospital-connections");
  return Array.isArray(data) ? data : [];
}

/**
 * Onboard a new hospital. The backend generates the unique `hospitalId`
 * (format HSP-XXXXX) — it is returned on the created connection.
 */
export async function createHospitalConnection({ name, email, baseUrl, apiKey } = {}) {
  const payload = { name, email, baseUrl };
  if (apiKey) payload.apiKey = apiKey;
  const { data } = await axiosInstance.post("/hospital-connections", payload);
  return data;
}


export function pharmacyStatusTone(status) {
  switch (status) {
    case "APPROVED":
      return { label: "Approved", badge: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500" };
    case "REJECTED":
      return { label: "Rejected", badge: "bg-rose-500/10 text-rose-600", dot: "bg-rose-500" };
    case "PENDING":
    default:
      return { label: "Pending", badge: "bg-amber-500/10 text-amber-600", dot: "bg-amber-500" };
  }
}

export function accountStatusTone(status) {
  switch (status) {
    case "ACTIVE":
      return { label: "Active", badge: "bg-emerald-500/10 text-emerald-600" };
    case "LOCKED":
      return { label: "Locked", badge: "bg-rose-500/10 text-rose-600" };
    case "PENDING":
    default:
      return { label: "Pending", badge: "bg-amber-500/10 text-amber-600" };
  }
}
