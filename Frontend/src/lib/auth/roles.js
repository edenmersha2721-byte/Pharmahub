/** Roles as emitted by the backend JWT `role` claim. */
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  PHARMACY: "PHARMACY",
  ADMIN: "ADMIN",
};


export function roleHome(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.PHARMACY:
      return "/pharmacy";
    case ROLES.CUSTOMER:
    default:
      return "/dashboard";
  }
}
