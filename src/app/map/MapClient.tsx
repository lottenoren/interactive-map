// src/app/map/MapClient.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

// Viktig: dynamisk import av react-leaflet-komponenter
const MapContainer = dynamic(
  () => import("react-leaflet").then(m => m.MapContainer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then(m => m.GeoJSON),
  { ssr: false }
);

export default function MapClient() {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const countryStyle = {
    color: "rgb(60 60 60)",
    weight: 1,
    fillColor: "#ffffff",
    fillOpacity: 0.8,
  };

  const highlightStyle = {
    fillColor: "rgb(0,116,217)",
    fillOpacity: 0.9,
    color: "rgb(60 60 60)",
    weight: 2,
  };

  const onEachCountry = (feature: any, layer: any) => {
    const name = feature?.properties?.ADMIN || feature?.properties?.NAME || feature?.properties?.name;
    if (!name) return;

    layer.on("mouseover", (e: any) => {
      const hoveredLayer = e.target;
      hoveredLayer.setStyle(highlightStyle);
      hoveredLayer.bringToFront();
    });

    layer.on("mouseout", (e: any) => {
      e.target.setStyle(countryStyle);
    });

    layer.on("click", async (e: any) => {
      e.originalEvent?.stopPropagation();
      e.target.setStyle(countryStyle);

      const loadingPopup = `
        <div style="text-align:center;padding:15px;">
          <div style="font-size:14px;">Laster informasjon om <strong>${name}</strong>...</div>
        </div>`;
      layer.bindPopup(loadingPopup, { maxWidth: 250, className: "loading-popup" }).openPopup();

      try {
        const variants = [name, name.replace(/\s+/g, " ").trim(), name.split("(")[0].trim()];
        let country = null;

        for (const v of variants) {
          const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(v)}?fullText=true`);
          if (res.ok) {
            const data = await res.json();
            if (data?.[0]) { country = data[0]; break; }
          }
        }
        if (!country) throw new Error("no country");

        const encoded = encodeURIComponent(country.name.common);
        const geometryData = { type: "Feature", properties: feature.properties, geometry: feature.geometry };
        sessionStorage.setItem(`country_geometry_${country.name.common}`, JSON.stringify(geometryData));

        const popupContent = `
          <div style="max-width:280px;font-size:13px;line-height:1.4;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI;">
            <img src="${country.flags.svg}" alt="Flagg"
                 style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:10px;"
                 onerror="this.style.display='none'" />
            <h3 style="margin:0 0 10px;font-size:16px;color:#2c3e50;text-align:center;font-weight:600;">
              ${country.name.common}
            </h3>
            <div style="margin-bottom:8px;"><strong>🌍 Region:</strong> ${country.region}${country.subregion ? ` – ${country.subregion}` : ""}</div>
            <div style="margin-bottom:8px;"><strong>🏛️ Hovedstad:</strong> ${country.capital?.[0] ?? "Ukjent"}</div>
            <div style="margin-bottom:12px;"><strong>🗣️ Språk:</strong> ${country.languages ? Object.values(country.languages).slice(0,3).join(", ") : "Ukjent"}</div>
            <div style="text-align:center;margin-top:15px;">
              <a href="/countries/${encoded}" target="_blank"
                 style="color:#fff;background:#F97316;text-decoration:none;font-weight:600;padding:8px 16px;border-radius:6px;display:inline-block;">
                Se detaljert side
              </a>
            </div>
          </div>`;
        layer.bindPopup(popupContent, { maxWidth: 320, className: "country-popup" }).openPopup();
      } catch {
        const errorPopup = `
          <div style="text-align:center;padding:15px;color:#d32f2f;">
            <div style="font-size:16px;margin-bottom:8px;">⚠️</div>
            <div style="margin-bottom:8px;"><strong>Kunne ikke laste informasjon om ${name}</strong></div>
            <div style="font-size:12px;color:#666;">
              Prøv et annet land eller <a href="/countries" style="color:#0074d9;">gå til landoversikten</a>
            </div>
          </div>`;
        layer.bindPopup(errorPopup, { maxWidth: 250, className: "error-popup" }).openPopup();
      }
    });

    layer.bindTooltip(name, { permanent: false, direction: "auto", className: "country-tooltip" });
  };

  if (loading) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg">Laster verdenskart...</div>
          <div className="text-sm text-gray-600 mt-2">Dette kan ta noen sekunder</div>
        </div>
      </main>
    );
  }

  if (!geoData) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg">Kunne ikke laste kartet</div>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Prøv igjen
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-screen overflow-hidden">
        <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        style={{ height: "calc(100vh - 80px)", width: "100%" }} 
        attributionControl
        zoomControl
        >
        <GeoJSON
            key={`geojson-${Date.now()}`}
            data={geoData}
            style={() => countryStyle}
            onEachFeature={onEachCountry}
        />
        </MapContainer>

      <style jsx global>{`
        .country-tooltip { background: rgba(0,0,0,.8)!important; color:#fff!important; border:none!important; border-radius:4px!important; padding:6px 10px!important; font-size:12px!important; font-weight:bold!important; }
        .country-popup .leaflet-popup-content-wrapper { border-radius:10px!important; box-shadow:0 6px 20px rgba(0,0,0,.2)!important; border:1px solid rgba(0,0,0,.05)!important; }
        .country-popup .leaflet-popup-content { margin:15px!important; }
        .loading-popup .leaflet-popup-content-wrapper { border-radius:8px!important; background-color:#f0f8ff!important; }
        .error-popup .leaflet-popup-content-wrapper { border-radius:8px!important; background-color:#ffe6e6!important; }
        .leaflet-container { cursor: crosshair!important; }
        .leaflet-interactive { cursor: pointer!important; }
        .leaflet-popup-close-button { color:#666!important; font-size:18px!important; font-weight:bold!important; }
        .leaflet-popup-close-button:hover { color:#000!important; }
        .leaflet-overlay-pane svg, .leaflet-overlay-pane path { pointer-events:auto!important; }
        .leaflet-interactive:focus, .leaflet-overlay-pane path:focus { outline:none!important; }
      `}</style>
    </main>
  );
}
