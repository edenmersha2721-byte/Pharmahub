import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle, useMap } from "react-leaflet";
import { NavigationIcon } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buttonVariants } from "@/components/ui/button";
import { formatDistance, googleMapsDirectionsUrl } from "@/lib/helpers/helpers";
import { medicineStockStatus } from "@/features/customer/stock";

const ADDIS_ABABA = { lat: 8.9806, lng: 38.7578 }; // sensible default center


const pinCache = {};
function pinIcon(hex) {
  if (pinCache[hex]) return pinCache[hex];
  const icon = L.divIcon({
    className: "",
    html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.1 13 21 13 21s13-11.9 13-21C26 5.8 20.2 0 13 0z" fill="${hex}"/>
      <circle cx="13" cy="13" r="5" fill="white"/></svg>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });
  pinCache[hex] = icon;
  return icon;
}

function FitToPoints({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [points, map]);
  return null;
}

function FlyToSelected({ selected, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.latitude, selected.longitude], 16, { duration: 0.6 });
    const marker = markerRefs.current[selected.pharmacyId];
    if (marker) marker.openPopup();
  }, [selected, map, markerRefs]);
  return null;
}

export default function PharmacyMap({ userCoords, pharmacies, selected, radiusKm }) {
  const markerRefs = useRef({});

  const fitPoints = useMemo(() => {
    const pts = pharmacies.map((p) => ({ lat: p.latitude, lng: p.longitude }));
    if (userCoords) pts.push(userCoords);
    return pts;
  }, [pharmacies, userCoords]);

  const center =
    userCoords ??
    (pharmacies[0] ? { lat: pharmacies[0].latitude, lng: pharmacies[0].longitude } : ADDIS_ABABA);

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userCoords && radiusKm != null && (
        <Circle
          center={[userCoords.lat, userCoords.lng]}
          radius={radiusKm * 1000}
          pathOptions={{ color: "#6366f1", weight: 1, fillColor: "#6366f1", fillOpacity: 0.08 }}
        />
      )}

      {userCoords && (
        <CircleMarker
          center={[userCoords.lat, userCoords.lng]}
          radius={8}
          pathOptions={{ color: "#4f46e5", fillColor: "#6366f1", fillOpacity: 0.9, weight: 3 }}
        >
          <Popup>You are here</Popup>
        </CircleMarker>
      )}

      {pharmacies.map((p) => (
        <Marker
          key={p.pharmacyId}
          position={[p.latitude, p.longitude]}
          icon={pinIcon(medicineStockStatus(p).hex)}
          ref={(ref) => {
            if (ref) markerRefs.current[p.pharmacyId] = ref;
          }}
        >
          <Popup>
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground">{p.pharmacyName}</p>
              <p className="text-xs text-muted-foreground">
                {p.address}
                {p.city ? `, ${p.city}` : ""}
              </p>
              {p.distanceMeters != null && (
                <p className="text-xs font-medium text-indigo-600">
                  {formatDistance(p.distanceMeters)} away
                </p>
              )}
              <a
                href={googleMapsDirectionsUrl(p.latitude, p.longitude, userCoords?.lat, userCoords?.lng)}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "xs",
                  className: "mt-1 gap-1 border-indigo-200 text-indigo-700",
                })}
              >
                <NavigationIcon className="size-3" />
                Navigate
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      <FitToPoints points={fitPoints} />
      <FlyToSelected selected={selected} markerRefs={markerRefs} />
    </MapContainer>
  );
}
