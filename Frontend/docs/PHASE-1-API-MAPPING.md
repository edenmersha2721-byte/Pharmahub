# Phase 1 — Backend Integration Map & Data Flow

> Derived **directly from backend source** (controllers, DTOs, gateway routes, JWT filter).
> Backend is treated as read-only. This document maps every endpoint the frontend needs,
> binds it to a page/component, and defines the per-role data flow.

---

## 1. Architecture Snapshot

All frontend traffic goes through the **API Gateway** (`http://localhost:8080`). The gateway
validates the JWT and forwards identity to downstream services as headers. Services are never
called directly by the browser.

| Service | Gateway prefix | Downstream | Controller base path |
|---|---|---|---|
| Auth | `/api/auth/**` | `:8081` | `/api/auth`, `/api/auth/admin` |
| Inventory | `/api/inventory/**` | `:8082` | `/api/inventory` |
| Search | `/api/search/**` | `:8083` | **`/api/v1/search`** ⚠️ (see §6) |
| Prescription | `/api/prescriptions/**` | `:8084` | `/api/prescriptions` |
| Reservation | `/api/reservations/**` | `:8085` | **no service exists** ⚠️ (see §6) |

CORS at gateway allows `http://localhost:5173` (Vite) and `:3000`, with credentials.

---

## 2. Auth & Identity Model (what the frontend must implement)

- **Login** returns `AuthResponse`: `{ accessToken, refreshToken, tokenType, accessTokenExpiresIn, role }`.
  ⚠️ **It does NOT return the user id.**
- The **JWT access token** carries: `sub` = userId (UUID), `email`, `role` (`CUSTOMER` | `PHARMACY` | `ADMIN`, no `ROLE_` prefix).
- → Frontend obtains `userId` by **decoding the JWT `sub`** (or calling `GET /api/auth/me`).
- **`pharmacyId === userId`** for a pharmacy account (ownership check is `currentUser.userId == pharmacyId`).
  So a pharmacy manages inventory at `/api/inventory/pharmacies/{ownUserId}/medicines`.
- **All authenticated requests** send `Authorization: Bearer <accessToken>`. The frontend must
  **never** send `X-User-Id` / `X-User-Role` — those are injected by the gateway.
- **Token refresh**: `POST /api/auth/refresh?refreshToken=...` → new `AuthResponse`.
  Wire this into the Axios 401 interceptor.
- **Roles**: `CUSTOMER`, `PHARMACY`, `ADMIN` — drive route guards.

---

## 3. Endpoint Inventory (full contracts)

### 3.1 Auth Service — `/api/auth`
| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/register/customer` | public | `CustomerRegisterRequest` {email, password, firstName, lastName, phoneNumber} | 201 `MessageResponse` |
| POST | `/register/pharmacy` | public | `PharmacyRegisterRequest` {email, password, pharmacyName, licenseNumber, phoneNumber, address, city, latitude, longitude} | 201 `MessageResponse` |
| POST | `/login` | public | `LoginRequest` {email, password} | 200 `AuthResponse` |
| POST | `/admin/login` | public | `LoginRequest` | 200 `AuthResponse` |
| POST | `/refresh` | public | `?refreshToken=` (query) | 200 `AuthResponse` |
| POST | `/logout` | bearer | `?refreshToken=` (query) + Authorization header | 200 `MessageResponse` |
| GET | `/verify-email` | public | `?token=` | 200 `MessageResponse` |
| POST | `/forgot-password` | public | `ForgotPasswordRequest` {email} | 200 `MessageResponse` |
| POST | `/reset-password` | public | `ResetPasswordRequest` {token, newPassword} | 200 `MessageResponse` |
| GET | `/me` | bearer | — | 200 `UserProfileResponse` {id, email, role, displayName, emailVerified} |
| PUT | `/pharmacies/{pharmacyId}/approval` | ADMIN | `?approve=true|false` | 204 |

### 3.2 Inventory Service — `/api/inventory`
| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/pharmacies/{pharmacyId}/medicines` | PHARMACY (owner) | `AddMedicineRequest` | 201 `MedicineResponse` |
| PUT | `/pharmacies/{pharmacyId}/medicines/{medicineId}` | PHARMACY (owner) | `UpdateStockRequest` | 200 `MedicineResponse` |
| DELETE | `/pharmacies/{pharmacyId}/medicines/{medicineId}` | PHARMACY (owner) | — | 200 `MessageResponse` |
| POST | `/pharmacies/{pharmacyId}/medicines/{medicineId}/deduct` | PHARMACY (owner) | `?amount=` (positive int) | 200 `MedicineResponse` |
| GET | `/pharmacies/{pharmacyId}/medicines` | PHARMACY (owner) | `?availableOnly&page&size` | 200 `PharmacyInventoryResponse` |
| GET | `/pharmacies/{pharmacyId}/medicines/{medicineId}` | PHARMACY (owner) | — | 200 `MedicineResponse` |
| GET | `/medicines/search` | any authenticated | `?medicineName&brandName&genericName&category&availableOnly&requiresPrescription&page&size` | 200 `PagedResponse<MedicineSearchResponse>` |

`AddMedicineRequest` / `UpdateStockRequest`: `{ medicineName*, genericName, brandName, category, description, price*, stockQuantity, requiresPrescription, expiryDate (yyyy-MM-dd) }`.
`category` is free text; suggested values: ANALGESIC, ANTIBIOTIC, ANTIVIRAL, ANTIFUNGAL, ANTIHISTAMINE, ANTIHYPERTENSIVE, ANTIDIABETIC, CARDIOVASCULAR, DERMATOLOGICAL, GASTROINTESTINAL, HORMONAL, NEUROLOGICAL, ONCOLOGICAL, OPHTHALMOLOGICAL, PSYCHIATRIC, RESPIRATORY, SUPPLEMENT, VACCINE, OTHER.

### 3.3 Search Service — `/api/v1/search` (⚠ path mismatch, see §6)
| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/` | authenticated | `?query*&lat&lng&radiusKm&requiresPrescription&category&page&size` | 200 `PagedResponse<NearbyMedicineResponse>` |
| GET | `/nearby` | authenticated | `?lat*&lng*&radiusKm(=10)&page&size` | 200 `PagedResponse<PharmacySearchResult>` |
| POST | `/prescription` | authenticated | `PrescriptionSearchRequest` {medicineNames[], lat, lng, radiusKm, page, size} | 200 `PagedResponse<NearbyMedicineResponse>` |

> Note: the public string search **forces `requiresPrescription=false`** server-side — Rx-only items
> are only discoverable via the prescription flow.

`NearbyMedicineResponse`: `{ medicineId, medicineName, genericName, brandName, category, requiresPrescription, price, stockQuantity, available, pharmacyId, pharmacyName, address, city, latitude, longitude, distanceMeters }` — has everything needed for **list + Leaflet markers**.
`PharmacySearchResult`: `{ pharmacyId, pharmacyName, address, city, latitude, longitude, distanceMeters, availableMedicineCount }`.

### 3.4 Prescription Service — `/api/prescriptions`
| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/upload` | CUSTOMER / ADMIN | `multipart/form-data`: `file*` (jpeg/png/pdf, max checked server-side), `latitude`, `longitude`, `radiusKm` | 201 `ExtractedMedicinesResponse` {prescriptionId, extractedMedicines[], pharmacyResults, message} |
| GET | `/{id}` | owner / ADMIN | — | 200 `PrescriptionResponse` |
| GET | `/customer/{customerId}` | owner / ADMIN | — | 200 `CustomerPrescriptionsResponse` |

`PrescriptionResponse`: `{ prescriptionId, customerId, status, extractedMedicines[], imageUrl, createdAt }`.
`pharmacyResults` on upload is the embedded search result payload (shape = `PagedResponse<NearbyMedicineResponse>`).

---

## 4. Frontend API Mapping (endpoint → existing page/component)

| Existing frontend file | Calls |
|---|---|
| `features/auth/pages/LoginPage.jsx` | POST `/api/auth/login` → store tokens, decode JWT for `{userId, role}` |
| `features/auth/pages/RegisterPage.jsx` + `RegistrationForm.jsx` | POST `/api/auth/register/customer` **or** `/register/pharmacy` |
| `features/auth/pages/ForgotPasswordPage.jsx` | POST `/api/auth/forgot-password` |
| `features/auth/pages/ResetPasswordPage.jsx` | POST `/api/auth/reset-password` (token from URL) |
| `features/auth/hooks/useAuth.js` | `/api/auth/me`, `/api/auth/refresh`, `/api/auth/logout` |
| `features/customer/pages/MedicineSearchPage.jsx` + `hooks/useMedicines.js` | GET `/api/search?query&lat&lng&radiusKm` |
| `features/customer/pages/SearchResultsPage.jsx` | renders `NearbyMedicineResponse[]` → list + Leaflet markers + distance |
| `features/customer/pages/PrescriptionsUploadPage.jsx` | POST `/api/prescriptions/upload` (multipart + geo) |
| `features/customer/pages/PrescriptionStatusPage.jsx` | GET `/api/prescriptions/{id}` ; GET `/api/prescriptions/customer/{customerId}` |
| `features/customer/pages/CustomerDashboardPage.jsx` | `/api/auth/me`, recent prescriptions |
| `features/pharmacy/pages/InventoryPage.jsx` | GET/POST/PUT/DELETE `/api/inventory/pharmacies/{ownId}/medicines...`, `/deduct` |
| `features/profile/components/PharmacyProfilePage.jsx` | `/api/auth/me` (limited fields — see §6 gap) |
| `features/admin/pages/ManagePharmacyPage.jsx` | PUT `/api/auth/pharmacies/{id}/approval` (⚠ no *list pending* endpoint — §6) |
| `features/admin/pages/ManageUserPage.jsx` | ⚠ **no backend list-users endpoint** (§6) |
| `features/admin/pages/AdminDashboardPage.jsx` / `PharmacyVitals.jsx` | ⚠ depends on admin read endpoints that don't exist yet |
| `features/pharmacy/pages/ReservationsPage.jsx`, `OrderDetailsPage.jsx`, `ReservationStatusPage.jsx`, `customer/hooks/useReservationsPage.jsx` | ⚠ **reservation service does not exist** (§6) |

---

## 5. Data Flow Per Role

### USER (Customer)
1. **Register** → `POST /register/customer` → verify email (`/verify-email?token`) → **Login** → store `{accessToken, refreshToken}`, decode JWT → `{userId, role=CUSTOMER}`.
2. **Medicine search**: get browser GPS → `GET /api/search?query=&lat=&lng=&radiusKm=` → render sorted-by-distance list + Leaflet markers (`latitude/longitude/distanceMeters` in each row).
3. **Prescription search**: upload file + GPS → `POST /api/prescriptions/upload` → response gives `extractedMedicines[]` + embedded `pharmacyResults` (nearby pharmacies stocking them). History via `GET /api/prescriptions/customer/{userId}`.
4. **Token expiry** → Axios interceptor calls `/api/auth/refresh` transparently.

### PHARMACY
1. **Register** → `POST /register/pharmacy` (includes `latitude/longitude/license/address/city`) → verify email → **wait for admin approval** → Login (blocked until approved).
2. **Inventory management** (`pharmacyId = own userId`): list `GET /pharmacies/{id}/medicines`, add `POST`, edit `PUT`, delete `DELETE`, deduct stock `POST .../deduct?amount=`. Adding a medicine auto-indexes it into Search (server-side via `/index/medicine`).
3. **Profile**: currently only `/api/auth/me` (id/email/role/displayName/emailVerified). Full profile (address, license, geo) read endpoint is missing — §6.

### ADMIN
1. **Login** → `POST /api/auth/admin/login`.
2. **Approve/reject pharmacy** → `PUT /api/auth/pharmacies/{pharmacyId}/approval?approve=true|false`.
3. **Cross-pharmacy medicine search** (moderation) → `GET /api/inventory/medicines/search`.
4. ⚠ Listing users / listing pending pharmacies / system metrics → **no endpoints** (§6).

---

## 6. Gaps & Blockers (require backend owner — NOT fixable in frontend)

1. **🔴 Gateway JWT filter is disabled.** The `JwtAuth` named filter is commented out on every
   route in `gateway/application.yml`, yet inventory/search/prescription/`/me` **throw** if the
   `X-User-Id` header is absent (`GatewayHeaderExtractor`). As wired today, every authenticated
   downstream call fails. **The gateway must enable the JWT filter** before the frontend can
   integrate beyond public auth endpoints. *(Frontend assumption: send `Bearer` token; gateway injects identity.)*

2. **🔴 Search path mismatch.** Gateway forwards `/api/search/**` unchanged, but the controller is
   mounted at `/api/v1/search`. With no `RewritePath`/`StripPrefix` filter, `/api/search/...` → 404.
   Needs a gateway rewrite **or** controller remap. *(Frontend will target `/api/search/...` via gateway and is blocked until resolved.)*

3. **🟠 No admin read endpoints.** `ManageUserPage`, `ManagePharmacyPage`, `AdminDashboardPage`
   need *list users*, *list pending pharmacies*, *metrics* — none exist. Only single-pharmacy
   approval is available. These admin pages can't be fully data-driven yet.

4. **🟠 Reservation service absent.** Gateway routes `/api/reservations/**` to `:8085`, but no such
   service/controller exists. All reservation/order pages have no backend → defer.

5. **🟡 Pharmacy self-profile read.** No endpoint returns a pharmacy's own address/license/geo;
   `/api/auth/me` returns only `{id, email, role, displayName, emailVerified}`.

6. **🟡 Login lacks `userId`.** Must decode JWT `sub` (or call `/me`) to get the id used in
   inventory/prescription paths.

---

## 7. Assumptions To Confirm (Phase 2 inputs)

- Frontend talks **only** to the gateway at a single configurable base URL (`VITE_API_BASE_URL=http://localhost:8080`).
- Auth state = `{ accessToken, refreshToken, userId, role }`; `userId`/`role` decoded from JWT.
- Missing deps to be added when first needed: `axios`, `react-router-dom`, `leaflet` + `react-leaflet`, and a data-fetching layer (`@tanstack/react-query`, given existing `lib/queryClient.js`).
- Build order proposal (one module per step): **Auth → Customer medicine search + map → Prescription upload → Pharmacy inventory → Admin approval** (admin list pages gated on Gap #3).
