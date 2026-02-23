"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function GlobalHeatMap({ data = [] }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // ✅ store Marker objects so we can remove them cleanly

  useEffect(() => {
    // 1) Create map once
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [20, 30],
        zoom: 1.4,
      });
    }

    const map = mapRef.current;

    // 2) Inject pulse keyframes once
    if (!document.getElementById("map-pulse-style")) {
      const style = document.createElement("style");
      style.id = "map-pulse-style";
      style.innerHTML = `
        @keyframes mapPulseRing {
          0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
          70%  { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // helper: remove old markers properly
    function clearMarkers() {
      markersRef.current.forEach((m) => {
        try {
          m.remove();
        } catch (_) {}
      });
      markersRef.current = [];
    }

    function addMarkers() {
      clearMarkers();

      (data || []).forEach((region) => {
        if (region?.lat == null || region?.lng == null) return;

        const count = region.count || 0;

        // Subtle scaling (cap size)
        const size = Math.min(26, Math.max(8, count * 0.35));

        // Pressure color scale
        let color = "rgba(80,180,255,0.9)"; // default cool blue

        if (count > 70)
          color = "rgba(255,90,90,0.9)"; // high pressure (red)
        else if (count > 40)
          color = "rgba(255,170,60,0.9)"; // elevated (orange)
        else if (count > 20) color = "rgba(255,230,90,0.9)"; // moderate (yellow)

        // container
        const container = document.createElement("div");
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
        container.style.position = "relative";

        // core dot
        const dot = document.createElement("div");
        dot.style.width = "100%";
        dot.style.height = "100%";
        dot.style.borderRadius = "50%";
        dot.style.background = color;
        dot.style.boxShadow = `0 0 10px ${color}`;

        // subtle ring
        const ring = document.createElement("div");
        ring.style.position = "absolute";
        ring.style.left = "50%";
        ring.style.top = "50%";
        ring.style.width = "100%";
        ring.style.height = "100%";
        ring.style.borderRadius = "50%";
        ring.style.border = `1.5px solid ${color}`;
        ring.style.transform = "translate(-50%, -50%)";

        const speed = Math.max(1.6, 3 - count / 50);
        ring.style.animation = `mapPulseRing ${speed}s infinite ease-out`;

        container.appendChild(ring);
        container.appendChild(dot);

        const marker = new maplibregl.Marker({ element: container })
          .setLngLat([region.lng, region.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3) Ensure markers render after map loads, and whenever data changes
    if (map.loaded()) {
      addMarkers();
    } else {
      map.once("load", addMarkers);
    }

    // 4) Cleanup when component unmounts
    return () => {
      clearMarkers();
      // do NOT remove the map here (you want it stable during page navigation)
    };
  }, [data]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "450px",
        borderRadius: "8px",
      }}
    />
  );
}
