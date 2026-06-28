import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormField from "@/features/auth/components/FormField";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/lib/auth/roles";
import { parseApiError } from "@/lib/helpers/helpers";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRequired,
  validateLatitude,
  validateLongitude,
  collectErrors,
} from "@/lib/helpers/validators";

const CUSTOMER_DEFAULTS = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const PHARMACY_DEFAULTS = {
  email: "",
  password: "",
  pharmacyName: "",
  licenseNumber: "",
  phoneNumber: "",
  address: "",
  city: "",
  latitude: "",
  longitude: "",
};

/**
 * Shared registration form. `role` selects which fields/endpoint to use.
 * Registration never auto-logs-in: customers must verify their email and
 * pharmacies additionally await admin approval — so on success we surface the
 * backend message and point the user to the login page.
 */
export default function RegistrationForm({ role }) {
  const isPharmacy = role === ROLES.PHARMACY;
  const { registerCustomer, registerPharmacy } = useAuth();

  const [form, setForm] = useState(isPharmacy ? PHARMACY_DEFAULTS : CUSTOMER_DEFAULTS);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setFormError("Geolocation is not supported by this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setErrors((prev) => ({ ...prev, latitude: "", longitude: "" }));
        setLocating(false);
      },
      () => {
        setFormError("Could not get your location. Enter coordinates manually.");
        setLocating(false);
      }
    );
  };

  const validate = () => {
    const base = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      phoneNumber: validatePhone(form.phoneNumber),
    };
    if (isPharmacy) {
      return collectErrors({
        ...base,
        pharmacyName: validateRequired(form.pharmacyName, "Pharmacy name"),
        licenseNumber: validateRequired(form.licenseNumber, "License number"),
        address: validateRequired(form.address, "Address"),
        city: validateRequired(form.city, "City"),
        latitude: validateLatitude(form.latitude),
        longitude: validateLongitude(form.longitude),
      });
    }
    return collectErrors({
      ...base,
      firstName: validateName(form.firstName, "First name"),
      lastName: validateName(form.lastName, "Last name"),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      if (isPharmacy) {
        await registerPharmacy({
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        });
      } else {
        await registerCustomer(form);
      }
      setSuccessMessage(
        isPharmacy
          ? "Registration successful. Verify your email — your account also needs admin approval before you can sign in."
          : "Registration successful. Please check your email to verify your account."
      );
    } catch (err) {
      const { message, field } = parseApiError(err, "Registration failed. Please try again.");
      if (field) setErrors((prev) => ({ ...prev, [field]: message }));
      else setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="rounded-lg bg-primary/10 px-3 py-3 text-sm text-foreground">
          {successMessage}
        </p>
        <a href="/login" className="text-sm font-medium text-primary hover:underline">
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={update("email")}
        error={errors.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={form.password}
        onChange={update("password")}
        error={errors.password}
      />

      {isPharmacy ? (
        <>
          <FormField
            id="pharmacyName"
            label="Pharmacy name"
            value={form.pharmacyName}
            onChange={update("pharmacyName")}
            error={errors.pharmacyName}
          />
          <FormField
            id="licenseNumber"
            label="License number"
            value={form.licenseNumber}
            onChange={update("licenseNumber")}
            error={errors.licenseNumber}
          />
          <FormField
            id="address"
            label="Address"
            value={form.address}
            onChange={update("address")}
            error={errors.address}
          />
          <FormField
            id="city"
            label="City"
            value={form.city}
            onChange={update("city")}
            error={errors.city}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="latitude"
              label="Latitude"
              type="number"
              step="any"
              placeholder="8.9912"
              value={form.latitude}
              onChange={update("latitude")}
              error={errors.latitude}
            />
            <FormField
              id="longitude"
              label="Longitude"
              type="number"
              step="any"
              placeholder="38.7634"
              value={form.longitude}
              onChange={update("longitude")}
              error={errors.longitude}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={useMyLocation}
            disabled={locating}
          >
            {locating ? "Locating…" : "Use my current location"}
          </Button>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="firstName"
            label="First name"
            value={form.firstName}
            onChange={update("firstName")}
            error={errors.firstName}
          />
          <FormField
            id="lastName"
            label="Last name"
            value={form.lastName}
            onChange={update("lastName")}
            error={errors.lastName}
          />
        </div>
      )}

      <FormField
        id="phoneNumber"
        label="Phone number (optional)"
        type="tel"
        placeholder="+251911223344"
        value={form.phoneNumber}
        onChange={update("phoneNumber")}
        error={errors.phoneNumber}
      />

      {formError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
