import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/features/auth/components/FormField";
import * as authApi from "@/features/auth/api/authApi";
import { parseApiError } from "@/lib/helpers/helpers";
import { validatePassword, collectErrors } from "@/lib/helpers/validators";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = collectErrors({
      newPassword: validatePassword(form.newPassword),
      confirm: form.newPassword !== form.confirm ? "Passwords do not match" : "",
    });
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await authApi.resetPassword({ token, newPassword: form.newPassword });
      setDone(true);
    } catch (err) {
      const { message } = parseApiError(err, "Could not reset your password. The link may have expired.");
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Reset your password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="flex flex-col gap-4 text-center">
              <p className="rounded-lg bg-primary/10 px-3 py-3 text-sm text-foreground">
                Your password has been reset. You can now sign in with your new password.
              </p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Go to sign in
              </Link>
            </div>
          ) : !token ? (
            <div className="flex flex-col gap-4 text-center">
              <p className="rounded-lg bg-destructive/10 px-3 py-3 text-sm text-destructive">
                This reset link is invalid or incomplete. Please request a new one.
              </p>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <FormField
                id="newPassword"
                label="New password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.newPassword}
                onChange={update("newPassword")}
                error={errors.newPassword}
              />
              <FormField
                id="confirm"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={update("confirm")}
                error={errors.confirm}
              />

              {formError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                {submitting ? "Resetting…" : "Reset password"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
