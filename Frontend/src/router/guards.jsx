import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { roleHome } from "@/lib/auth/roles";
import LandingPage from "@/features/landing/LandingPage";


/**
 * Root ("/"): authenticated users go to their role home; logged-out visitors
 * see the public landing page.
 */
export function RootRedirect() {
  const { status, isAuthenticated, user } = useAuth();
  if (status === "loading") return null;
  if (isAuthenticated) return <Navigate to={roleHome(user?.role)} replace />;
  return <LandingPage />;
}


export function PublicOnlyRoute() {
  const { status, isAuthenticated, user } = useAuth();
  if (status === "loading") return null;
  if (isAuthenticated) return <Navigate to={roleHome(user?.role)} replace />;
  return <Outlet />;
}

/**
 * Temporary authenticated landing. The Customer / Pharmacy / Admin feature
 * modules will replace these placeholders; for now they prove the end-to-end
 * auth + role-guard + logout flow works.
 */
export function RoleLanding({ title }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        <br />
        Role: <span className="font-medium text-foreground">{user?.role}</span>
      </p>
      <button
        onClick={logout}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Log out
      </button>
    </div>
  );
}
