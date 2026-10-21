"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Company } from "@/lib/mock-data";

interface LeafletMapProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
}

const SCHOOL_POS: [number, number] = [-7.9750644, 112.6717543];

const schoolIcon = L.icon({
  iconUrl: "/markers/school-marker.svg",
  iconSize: [44, 44],
  iconAnchor: [22, 42],
  popupAnchor: [0, -40],
});

const officeIcon = L.icon({
  iconUrl: "/markers/office-marker.svg",
  iconSize: [38, 38],
  iconAnchor: [19, 36],
  popupAnchor: [0, -35],
});

export default function LeafletMap({
  companies,
  selectedCompany,
  onSelectCompany,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const polylinesRef = useRef<Record<string, L.Polyline>>({});
  const dataLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SCHOOL_POS,
      zoom: 12,
      scrollWheelZoom: true,
    });

    // 100% Free OpenStreetMap Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // School Marker
    L.marker(SCHOOL_POS, { icon: schoolIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: inherit; padding: 4px;">
          <strong style="color: #1E293B; font-size: 13px;">SMK Negeri 6 Malang</strong>
          <p style="color: #64748B; font-size: 11px; margin-top: 2px;">Pusat Titik Penempatan PKL</p>
        </div>`
      );

    dataLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync companies, markers, and connecting lines to school
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = dataLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersRef.current = {};
    polylinesRef.current = {};

    companies.forEach((comp) => {
      if (typeof comp.lat !== "number" || typeof comp.lng !== "number") return;

      // Connecting line from Industry to SMKN 6 Malang
      const line = L.polyline([[comp.lat, comp.lng], SCHOOL_POS], {
        color: "#3B82F6",
        weight: 3,
        opacity: 1,
        dashArray: "6, 6",
      }).addTo(layer);

      const distanceKm = (map.distance([comp.lat, comp.lng], SCHOOL_POS) / 1000).toFixed(1);

      const marker = L.marker([comp.lat, comp.lng], { icon: officeIcon })
        .addTo(layer)
        .bindPopup(
          `<div style="font-family: inherit; width: 200px; padding: 2px;">
            <strong style="color: #0F172A; font-size: 13px; display: block;">${comp.name}</strong>
            <span style="color: #2563EB; font-size: 10px; font-weight: 700; text-transform: uppercase;">${comp.category || "Mitra Industri"}</span>
            <p style="color: #475569; font-size: 11px; margin: 4px 0; line-height: 1.3;">${comp.address || ""}</p>
            <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
              <span style="color: #E11D48; font-weight: 600;">📍 ~${distanceKm} km</span>
              <a href="/companies/${comp.slug}" style="color: #2563EB; font-weight: 700; text-decoration: none;">Detail &rarr;</a>
            </div>
          </div>`
        );

      marker.on("click", () => onSelectCompany(comp));
      markersRef.current[comp.id] = marker;
      polylinesRef.current[comp.id] = line;
    });
  }, [companies, onSelectCompany]);

  // Highlight selected company and its connecting line
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCompany) return;

    mapInstanceRef.current.flyTo([selectedCompany.lat, selectedCompany.lng], 15, { duration: 0.8 });
    const marker = markersRef.current[selectedCompany.id];
    if (marker) marker.openPopup();

    Object.entries(polylinesRef.current).forEach(([id, line]) => {
      if (id === selectedCompany.id) {
        line.setStyle({ color: "#2563EB", weight: 3.5, opacity: 1, dashArray: "" });
        line.bringToFront();
      } else {
        line.setStyle({ color: "#93C5FD", weight: 3, opacity: 1, dashArray: "6, 6" });
      }
    });
  }, [selectedCompany]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
