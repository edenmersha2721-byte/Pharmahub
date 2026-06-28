import axiosInstance from "@/lib/axios/axiosInstance";


export async function searchMedicines({
  query,
  lat,
  lng,
  radiusKm,
  category,
  page = 0,
  size = 20,
}) {
  const params = { query, page, size };
 
  if (lat != null && lng != null) {
    params.lat = lat;
    params.lng = lng;
    if (radiusKm != null) params.radiusKm = radiusKm;
  }
  if (category) params.category = category;

  const { data } = await axiosInstance.get("/search", { params });
  return data;
}
