import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "@/router/routes";
import { ROLES } from "@/lib/auth/roles";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { RootRedirect, PublicOnlyRoute } from "@/router/guards";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import CustomerLayout from "@/features/customer/components/CustomerLayout";
import CustomerDashboardPage from "@/features/customer/pages/CustomerDashboardPage";
import MedicineSearchPage from "@/features/customer/pages/MedicineSearchPage";
import PrescriptionsUploadPage from "@/features/customer/pages/PrescriptionsUploadPage";
import MyProfilePage from "@/features/customer/pages/MyProfilePage";
import PharmacyLayout from "@/features/pharmacy/components/PharmacyLayout";
import PharmacyDashboardPage from "@/features/pharmacy/pages/PharmacyDashboardPage";
import InventoryPage from "@/features/pharmacy/pages/InventoryPage";
import AdminLayout from "@/features/admin/components/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import ManagePharmacyPage from "@/features/admin/pages/ManagePharmacyPage";
import ManageUserPage from "@/features/admin/pages/ManageUserPage";
import ManageHospitalPage from "@/features/admin/pages/ManageHospitalPage";

export const router = createBrowserRouter([
  { path: PATHS.ROOT, element: <RootRedirect /> },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: PATHS.LOGIN, element: <LoginPage /> },
      { path: PATHS.REGISTER, element: <RegisterPage /> },
      { path: PATHS.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: PATHS.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: PATHS.CUSTOMER_HOME, element: <CustomerDashboardPage /> },
          { path: PATHS.CUSTOMER_SEARCH, element: <MedicineSearchPage /> },
          { path: PATHS.CUSTOMER_PRESCRIPTIONS, element: <PrescriptionsUploadPage /> },
          { path: PATHS.CUSTOMER_PROFILE, element: <MyProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.PHARMACY]} />,
    children: [
      {
        element: <PharmacyLayout />,
        children: [
          { path: PATHS.PHARMACY_HOME, element: <PharmacyDashboardPage /> },
          { path: PATHS.PHARMACY_INVENTORY, element: <InventoryPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: PATHS.ADMIN_HOME, element: <AdminDashboardPage /> },
          { path: PATHS.ADMIN_PHARMACIES, element: <ManagePharmacyPage /> },
          { path: PATHS.ADMIN_USERS, element: <ManageUserPage /> },
          { path: PATHS.ADMIN_HOSPITALS, element: <ManageHospitalPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to={PATHS.ROOT} replace /> },
]);

export default router;
