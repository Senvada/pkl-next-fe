"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Company } from "@/lib/mock-data";
import { SCHOOL_POS, schoolIcon, officeIcon, createCompanyPopupHtml } from "./maps-utils";

if (typeof window !== "undefined") {
  (window as unknown as { L: typeof L }).L = L;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet.markercluster");
}

interface LeafletMapProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  showAllLines?: boolean;
}

export default function LeafletMap({
  companies,
  selectedCompany,
  onSelectCompany,
  showAllLines = false,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const activeLineRef = useRef<L.Polyline | null>(null);
  const allLinesLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SCHOOL_POS,
      zoom: 12,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker(SCHOOL_POS, { icon: schoolIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: inherit; padding: 4px;">
          <strong style="color: #1E293B; font-size: 13px;">SMK Negeri 6 Malang</strong>
          <p style="color: #64748B; font-size: 11px; margin-top: 2px;">Pusat Titik Penempatan PKL</p>
        </div>`
      );

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    map.addLayer(cluster);
    clusterGroupRef.current = cluster;

    const allLinesLayer = L.layerGroup().addTo(map);
    allLinesLayerRef.current = allLinesLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync markers in cluster
  useEffect(() => {
    const cluster = clusterGroupRef.current;
    const map = mapInstanceRef.current;
    if (!cluster || !map) return;

    cluster.clearLayers();
    markersRef.current = {};

    companies.forEach((comp) => {
      if (typeof comp.lat !== "number" || typeof comp.lng !== "number") return;
      const distanceKm = (map.distance([comp.lat, comp.lng], SCHOOL_POS) / 1000).toFixed(1);
      const marker = L.marker([comp.lat, comp.lng], { icon: officeIcon })
        .bindPopup(createCompanyPopupHtml(comp, distanceKm));

      marker.on("click", () => onSelectCompany(comp));
      cluster.addLayer(marker);
      markersRef.current[comp.id] = marker;
    });
  }, [companies, onSelectCompany]);

  // Optional: All connecting lines toggle
  useEffect(() => {
    const allLinesLayer = allLinesLayerRef.current;
    if (!allLinesLayer) return;
    allLinesLayer.clearLayers();

    if (showAllLines) {
      companies.forEach((comp) => {
        if (typeof comp.lat !== "number" || typeof comp.lng !== "number") return;
        L.polyline([[comp.lat, comp.lng], SCHOOL_POS], {
          color: "#60A5FA",
          weight: 1.5,
          opacity: 0.4,
          dashArray: "4, 6",
        }).addTo(allLinesLayer);
      });
    }
  }, [companies, showAllLines]);

  // Highlight selected company with focused single line
  useEffect(() => {
    const map = mapInstanceRef.current;
    const cluster = clusterGroupRef.current;
    if (!map || !selectedCompany) return;

    if (typeof selectedCompany.lat === "number" && typeof selectedCompany.lng === "number") {
      map.flyTo([selectedCompany.lat, selectedCompany.lng], 15, { duration: 0.8 });

      const marker = markersRef.current[selectedCompany.id];
      if (marker && cluster) {
        cluster.zoomToShowLayer(marker, () => marker.openPopup());
      }

      if (activeLineRef.current) map.removeLayer(activeLineRef.current);

      const activeLine = L.polyline([[selectedCompany.lat, selectedCompany.lng], SCHOOL_POS], {
        color: "#2563EB",
        weight: 3.5,
        opacity: 0.95,
        dashArray: "6, 6",
      }).addTo(map);
      activeLine.bringToFront();
      activeLineRef.current = activeLine;
    }
  }, [selectedCompany]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
