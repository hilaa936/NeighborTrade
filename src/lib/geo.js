import { getLocality, LOCALITIES } from "./localities";

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

// Great-circle distance in km
export function distanceKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// Rounds coordinates to 2 decimals (~1 km) so a precise home location is never stored
export const roundCoord = (value) => Math.round(value * 100) / 100;

export function nearestLocality(point) {
  let best = null;
  let bestKm = Infinity;
  for (const locality of LOCALITIES) {
    const km = distanceKm(point, locality);
    if (km < bestKm) {
      best = locality;
      bestKm = km;
    }
  }
  return best;
}

// Resolves the location a user saves: explicit coordinates win, otherwise the locality center
export function resolveLocation({ localityId, lat, lng }) {
  if (lat != null && lng != null) {
    const point = { lat: roundCoord(lat), lng: roundCoord(lng) };
    return { localityId: localityId || nearestLocality(point)?.id || null, ...point };
  }
  const locality = getLocality(localityId);
  if (!locality) return { localityId: null, lat: null, lng: null };
  return { localityId: locality.id, lat: locality.lat, lng: locality.lng };
}

// What a viewer may know about where a listing is:
// "same city", an approximate distance, or just the city name when the viewer has no location
export function describeLocation(viewer, place) {
  if (!place?.lat && !place?.localityId) return null;
  if (viewer?.localityId && viewer.localityId === place.localityId) {
    return { kind: "sameCity" };
  }
  if (viewer?.lat != null && place.lat != null) {
    const km = distanceKm(viewer, place);
    return { kind: "distance", km: km < 1 ? 1 : km < 10 ? Math.round(km) : Math.round(km / 5) * 5 };
  }
  return place.localityId ? { kind: "city", localityId: place.localityId } : null;
}
