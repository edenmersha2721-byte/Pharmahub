import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/features/auth/components/FormField";
import * as authApi from "@/features/auth/api/authApi";
import { parseApiError } from "@/lib/helpers/helpers";
import { validateEmail } from "@/lib/helpers/validators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setFieldError(err);
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err2) {
      const { message, field } = parseApiError(err2, "Could not send the reset link. Please try again.");
      if (field === "email") setFieldError(message);
      else setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col gap-4 text-center">
              <p className="rounded-lg bg-primary/10 px-3 py-3 text-sm text-foreground">
                If an account exists for <span className="font-medium">{email}</span>, a password
                reset link has been sent. Check your inbox (and spam).
              </p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <FormField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldError("");
                  setFormError("");
                }}
                error={fieldError}
              />

              {formError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                {submitting ? "Sending…" : "Send reset link"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remembered it?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
