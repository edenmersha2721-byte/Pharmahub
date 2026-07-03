import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulseIcon, UserPlusIcon } from "lucide-react";
import AuthSplitLayout from "@/features/auth/components/AuthSplitLayout";
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
    <AuthSplitLayout wide>
      {/* Mobile brand */}
      <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
          <HeartPulseIcon className="size-5" />
        </span>
        <span className="font-heading text-lg font-bold tracking-tight">PharmaHub</span>
      </div>

      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
          <UserPlusIcon className="size-7" />
        </span>
        <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          Create your <span className="text-indigo-600">account</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Join PharmaHub as a customer or register your pharmacy
        </p>
      </div>

      {/* Role selector */}
      <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab.role}
            type="button"
            onClick={() => setRole(tab.role)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
      <div className="mt-4">
        <RegistrationForm key={role} role={role} />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
