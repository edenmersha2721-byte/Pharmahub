import axiosInstance from "@/lib/axios/axiosInstance";

/**
 * Report / accountability API (report-service, behind the gateway JwtAuth
 * filter which injects X-User-Id). Split by audience: customer, pharmacy, admin.
 */

// ---- Customer -------------------------------------------------------------

/** File a report against a pharmacy. */
export async function submitReport({ pharmacyId, category, description }) {
  const { data } = await axiosInstance.post("/reports", { pharmacyId, category, description });
  return data;
}

/** Reports the current customer has filed. */
export async function getMyReports({ page = 0, size = 20 } = {}) {
  const { data } = await axiosInstance.get("/reports/mine", { params: { page, size } });
  return data;
}

// ---- Pharmacy -------------------------------------------------------------

/** Reports filed against the current pharmacy. */
export async function getReportsAgainstMe({ page = 0, size = 20 } = {}) {
  const { data } = await axiosInstance.get("/pharmacy/reports", { params: { page, size } });
  return data;
}

/** Respond to a report (right to respond). */
export async function respondToReport(id, response) {
  const { data } = await axiosInstance.post(`/pharmacy/reports/${id}/respond`, { response });
  return data;
}

// ---- Admin ----------------------------------------------------------------

/** Moderation queue, optionally filtered by status. */
export async function getReportQueue({ status = null, page = 0, size = 20 } = {}) {
  const params = { page, size };
  if (status) params.status = status;
  const { data } = await axiosInstance.get("/admin/reports", { params });
  return data;
}

/** Pharmacies with the most unresolved reports. */
export async function getFlaggedPharmacies() {
  const { data } = await axiosInstance.get("/admin/reports/flagged");
  return Array.isArray(data) ? data : [];
}

export async function resolveReport(id, note) {
  const { data } = await axiosInstance.post(`/admin/reports/${id}/resolve`, note ? { note } : {});
  return data;
}

export async function dismissReport(id, note) {
  const { data } = await axiosInstance.post(`/admin/reports/${id}/dismiss`, note ? { note } : {});
  return data;
}

export async function warnPharmacy(pharmacyId, reason) {
  const { data } = await axiosInstance.post(
    `/admin/reports/pharmacies/${pharmacyId}/warn`,
    reason ? { reason } : {}
  );
  return data;
}

export async function suspendPharmacy(pharmacyId, { days, reason } = {}) {
  const body = {};
  if (days != null) body.days = days;
  if (reason) body.reason = reason;
  const { data } = await axiosInstance.post(`/admin/reports/pharmacies/${pharmacyId}/suspend`, body);
  return data;
}

export async function liftSuspension(pharmacyId) {
  const { data } = await axiosInstance.post(`/admin/reports/pharmacies/${pharmacyId}/lift-suspension`);
  return data;
}
