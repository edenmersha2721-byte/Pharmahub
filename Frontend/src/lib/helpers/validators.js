/**
 * Lightweight client-side validators that mirror the backend bean-validation
 * constraints (auth service request DTOs). Each returns an error string or "".
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{10,15}$/;

export function validateEmail(value) {
  if (!value?.trim()) return "Email is required";
  if (!EMAIL_RE.test(value)) return "Email must be valid";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 8 || value.length > 100)
    return "Password must be between 8 and 100 characters";
  return "";
}

export function validateRequired(value, label) {
  if (!value?.toString().trim()) return `${label} is required`;
  return "";
}

export function validateName(value, label) {
  if (!value?.trim()) return `${label} is required`;
  if (value.trim().length < 2 || value.trim().length > 50)
    return `${label} must be between 2 and 50 characters`;
  return "";
}

export function validatePhone(value) {
  // Phone is optional on the backend but validated when present.
  if (!value?.trim()) return "";
  if (!PHONE_RE.test(value)) return "Phone number must be valid (10-15 digits)";
  return "";
}

export function validateLatitude(value) {
  if (value === "" || value === null || value === undefined) return "Latitude is required";
  const n = Number(value);
  if (Number.isNaN(n) || n < -90 || n > 90) return "Latitude must be between -90 and 90";
  return "";
}

export function validateLongitude(value) {
  if (value === "" || value === null || value === undefined) return "Longitude is required";
  const n = Number(value);
  if (Number.isNaN(n) || n < -180 || n > 180) return "Longitude must be between -180 and 180";
  return "";
}

/** Runs a map of { field: errorString } and returns only the non-empty entries. */
export function collectErrors(map) {
  return Object.fromEntries(Object.entries(map).filter(([, v]) => v));
}
