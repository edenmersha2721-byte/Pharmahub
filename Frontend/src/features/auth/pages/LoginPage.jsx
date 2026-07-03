import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HeartPulseIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  Loader2Icon,
} from "lucide-react";
import AuthSplitLayout from "@/features/auth/components/AuthSplitLayout";
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
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthSplitLayout>
      {/* Mobile brand */}
      <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
          <HeartPulseIcon className="size-5" />
        </span>
        <span className="font-heading text-lg font-bold tracking-tight">PharmaHub</span>
      </div>

      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
          <HeartPulseIcon className="size-7" />
        </span>
        <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          Welcome <span className="text-indigo-600">back!</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to your PharmaHub account
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              className="h-11 w-full rounded-xl border border-foreground/10 bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
              className="h-11 w-full rounded-xl border border-foreground/10 bg-background pl-10 pr-10 text-sm outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_4px] focus:shadow-indigo-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>

        <Link
          to="/forgot-password"
          className="-mt-1 self-end text-xs font-semibold text-indigo-600 hover:underline"
        >
          Forgot password?
        </Link>

        {formError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRightIcon className="size-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
          Create one
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
