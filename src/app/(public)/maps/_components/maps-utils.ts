import L from "leaflet";
import type { Company } from "@/lib/mock-data";

export const SCHOOL_POS: [number, number] = [-7.9750644, 112.6717543];

export const schoolIcon = L.icon({
  iconUrl: "/markers/school-marker.svg",
  iconSize: [44, 44],
  iconAnchor: [22, 42],
  popupAnchor: [0, -40],
});

export const officeIcon = L.icon({
  iconUrl: "/markers/office-marker.svg",
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -32],
});

export function createCompanyPopupHtml(comp: Company, distanceKm: string): string {
  return `<div style="font-family: inherit; width: 210px; padding: 2px;">
    <strong style="color: #0F172A; font-size: 13px; display: block;">${comp.name}</strong>
    <span style="color: #2563EB; font-size: 10px; font-weight: 700; text-transform: uppercase;">${comp.category || "Mitra Industri"}</span>
    <p style="color: #475569; font-size: 11px; margin: 4px 0; line-height: 1.3;">${comp.address || ""}</p>
    <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
      <span style="color: #E11D48; font-weight: 600;">📍 ~${distanceKm} km</span>
      <a href="/companies/${comp.slug}" style="color: #2563EB; font-weight: 700; text-decoration: none;">Detail &rarr;</a>
    </div>
  </div>`;
}
