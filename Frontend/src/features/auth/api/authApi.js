import axiosInstance from "@/lib/axios/axiosInstance";



export async function login({ email, password }) {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data; 
}

export async function registerCustomer(payload) {
  const { data } = await axiosInstance.post("/auth/register/customer", payload);
  return data; 
}

export async function registerPharmacy(payload) {
  const { data } = await axiosInstance.post("/auth/register/pharmacy", payload);
  return data; 
}

export async function getCurrentUser() {
  const { data } = await axiosInstance.get("/auth/me");
  return data; 
}

export async function refreshSession(refreshToken) {
 
  const { data } = await axiosInstance.post("/auth/refresh", null, {
    params: { refreshToken },
  });
  return data; 
}

export async function forgotPassword(email) {
  const { data } = await axiosInstance.post("/auth/forgot-password", { email });
  return data; // MessageResponse
}

export async function resetPassword({ token, newPassword }) {
  const { data } = await axiosInstance.post("/auth/reset-password", { token, newPassword });
  return data; // MessageResponse
}

export async function logout(refreshToken) {
  const { data } = await axiosInstance.post("/auth/logout", null, {
    params: refreshToken ? { refreshToken } : undefined,
  });
  return data;
}
