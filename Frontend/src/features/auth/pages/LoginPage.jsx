import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/features/auth/components/FormField";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { roleHome } from "@/lib/auth/roles";
import { parseApiError } from "@/lib/helpers/helpers";
import { validateEmail, validatePassword, collectErrors } from "@/lib/helpers/validators";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = collectErrors({
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    });
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const user = await login(form);
      // Redirect to the originally requested page, or the role's home.
      const from = location.state?.from?.pathname;
      navigate(from ?? roleHome(user?.role), { replace: true });
    } catch (err) {
      const { message, field } = parseApiError(err, "Login failed. Check your email and password.");
      if (field) setErrors((prev) => ({ ...prev, [field]: message }));
      else setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Welcome back</CardTitle>
          <CardDescription>Sign in to your PharmaHub account</CardDescription>
        </CardHeader>
        <CardContent>
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
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
            />

            <Link
              to="/forgot-password"
              className="-mt-1 self-end text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>

            {formError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );  
}
