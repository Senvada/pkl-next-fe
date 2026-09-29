"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Company } from "@/lib/mock-data";

interface LeafletMapProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
}

const SCHOOL_POS: [number, number] = [-7.9750644, 112.6717543];

export default function LeafletMap({
  companies,
  selectedCompany,
  onSelectCompany,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: SCHOOL_POS,
      zoom: 12,
      scrollWheelZoom: false,
    });

    // Dark/Neutral CartoDB Tile Layer for modern look
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    // School Icon & Marker
    const schoolIcon = L.divIcon({
      html: `
        <div style="background-color: #2563EB; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37,99,235,0.4); border: 2.5px solid white;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
      `,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker(SCHOOL_POS, { icon: schoolIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: inherit; padding: 4px;">
          <strong style="color: #1E293B; font-size: 13px;">SMK Negeri 6 Malang</strong>
          <p style="color: #64748B; font-size: 11px; margin-top: 2px;">Pusat Titik Penempatan PKL</p>
        </div>`
      );

    // Company Marker Icons
    const companyIcon = L.divIcon({
      html: `
        <div style="background-color: #0EA5E9; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(14,165,233,0.4); border: 2px solid white; cursor: pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
          </svg>
        </div>
      `,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    companies.forEach((comp) => {
      const marker = L.marker([comp.lat, comp.lng], { icon: companyIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: inherit; max-width: 220px; padding: 4px;">
            <strong style="color: #0F172A; font-size: 13px; display: block;">${comp.name}</strong>
            <span style="color: #0284C7; font-size: 10px; font-weight: 600; text-transform: uppercase;">${comp.category}</span>
            <p style="color: #475569; font-size: 11px; margin-top: 4px; line-height: 1.3;">${comp.address}</p>
            <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
              <span style="color: #10B981; font-weight: 600;">Kuota: ${comp.openQuota} siswa</span>
              <a href="/companies/${comp.slug}" style="color: #2563EB; font-weight: 600; text-decoration: none;">Detail &rarr;</a>
            </div>
          </div>`
        );

      marker.on("click", () => {
        onSelectCompany(comp);
      });

      markersRef.current[comp.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [companies, onSelectCompany]);

  // Handle focus when selected company changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCompany) return;
    mapInstanceRef.current.flyTo(
      [selectedCompany.lat, selectedCompany.lng],
      15,
      { duration: 1 }
    );
    const marker = markersRef.current[selectedCompany.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedCompany]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
