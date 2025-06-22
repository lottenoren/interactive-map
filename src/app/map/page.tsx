"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

export default function WorldMapPage() {
  const [geoData, setGeoData] = useState<any>(null);
  const geoJsonRef = useRef<any>(null); // Bruk ref for resetStyle

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch((error) => console.error("Error loading geo data:", error));
  }, []);

  const countryStyle = {
    color: "#000",         // landegrenser
    weight: 1,
    fillColor: "#f5f5dc",  // beige
    fillOpacity: 0.8,
  };

  const highlightStyle = {
    fillColor: "#0074d9",  // blå hover
    fillOpacity: 0.9,
    color: "#000",
    weight: 2,
    dashArray: "3",
  };

  const onEachCountry = (feature: any, layer: any) => {
    const name = feature?.properties?.ADMIN;
    if (!name) return;

    // Hover inn
    layer.on("mouseover", (e: any) => {
      const hoveredLayer = e.target;
      hoveredLayer.setStyle(highlightStyle);
      hoveredLayer.bringToFront();
    });

    // Hover ut
    layer.on("mouseout", (e: any) => {
      if (geoJsonRef.current) {
        geoJsonRef.current.resetStyle(e.target);
      }
    });

    // Klikk
    layer.on("click", () => {
      const encoded = encodeURIComponent(name);
      window.location.href = `/countries/${encoded}`;
    });

    // Tooltip
    layer.bindTooltip(name, {
      permanent: false,
      direction: "auto",
      className: "country-tooltip",
    });
  };

  if (!geoData) {
    return (
      <main className="h-screen w-screen flex items-center justify-center">
        <div className="text-lg">Laster verdenskart...</div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="" attribution="" />
        <GeoJSON
          data={geoData}
          style={() => countryStyle}
          onEachFeature={onEachCountry}
          ref={geoJsonRef}
        />
      </MapContainer>

      <style jsx global>{`
        .country-tooltip {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
        }

        .leaflet-container {
          cursor: crosshair;
        }

        .leaflet-interactive {
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
