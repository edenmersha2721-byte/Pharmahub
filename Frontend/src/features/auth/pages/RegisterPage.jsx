import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrationForm from "@/features/auth/components/RegistrationForm";
import { ROLES } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const TABS = [
  { role: ROLES.CUSTOMER, label: "Customer" },
  { role: ROLES.PHARMACY, label: "Pharmacy" },
];

export default function RegisterPage() {
  const [role, setRole] = useState(ROLES.CUSTOMER);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Create your account</CardTitle>
          <CardDescription>Register as a customer or a pharmacy</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            {TABS.map((tab) => (
              <button
                key={tab.role}
                type="button"
                onClick={() => setRole(tab.role)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  role === tab.role
                    ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Remount the form when the role changes so field state resets cleanly */}
          <RegistrationForm key={role} role={role} />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
