import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { roleHome } from "@/lib/auth/roles";


export default function ProtectedRoute({ allowedRoles }) {
  const { status, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={roleHome(user?.role)} replace />;
  }

  return <Outlet />;
}
