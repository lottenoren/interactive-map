"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";

export default function WorldMapPage() {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    console.log("🚀 Starter lasting av geodata...");
    
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => {
        console.log("📡 API respons mottatt:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Geodata lastet:", data.features?.length, "land funnet");
        setGeoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Feil ved lasting av geodata:", error);
        setLoading(false);
      });
  }, []);

  const countryStyle = {
    color: "rgb(60 60 60)",
    weight: 1,
    fillColor: "#f5f5dc",
    fillOpacity: 0.8,
  };

  const highlightStyle = {
    fillColor: "rgb(230,149,94)",
    fillOpacity: 0.9,
    color: "rgb(60 60 60)",
    weight: 2,
  };

  const onEachCountry = (feature: any, layer: any) => {
    const name = feature?.properties?.ADMIN || feature?.properties?.NAME || feature?.properties?.name;
    console.log("🏳️ Setter opp land:", name);
    
    if (!name) {
      console.warn("⚠️ Land uten navn funnet:", feature?.properties);
      return;
    }

    // Test at event listeners faktisk blir lagt til
    console.log("🎯 Legger til event listeners for:", name);

    // Hover inn
    layer.on("mouseover", (e: any) => {
      console.log("🖱️ Hover inn på:", name);
      const hoveredLayer = e.target;
      hoveredLayer.setStyle(highlightStyle);
      hoveredLayer.bringToFront();
    });

    // Hover ut
    layer.on("mouseout", (e: any) => {
      console.log("🖱️ Hover ut fra:", name);
      e.target.setStyle(countryStyle);
    });

    // KLIKK - dette er hovedfunksjonen
    layer.on("click", async (e: any) => {
      console.log("🎯 KLIKK REGISTRERT på:", name);
      console.log("Event objekt:", e);
      
      // Stopp event propagation
      e.originalEvent?.stopPropagation();
      
      // Fjern eventuell highlight ved klikk
      e.target.setStyle(countryStyle);
      
      try {
        // Vis loading popup umiddelbart
        const loadingPopup = `
          <div style="text-align: center; padding: 15px;">
            <div style="font-size: 14px;">🔄 Laster informasjon om <strong>${name}</strong>...</div>
          </div>
        `;
        
        layer.bindPopup(loadingPopup, {
          maxWidth: 250,
          className: 'loading-popup'
        }).openPopup();

        console.log("📡 Henter data for:", name);
        
        // Prøv flere varianter av landnavnet
        const nameVariants = [
          name,
          name.replace(/\s+/g, ' ').trim(),
          name.split('(')[0].trim(), // Fjern parenteser
        ];

        let country = null;
        let res = null;

        for (const variant of nameVariants) {
          try {
            console.log("🔍 Prøver variant:", variant);
            res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(variant)}?fullText=true`);
            
            if (res.ok) {
              const data = await res.json();
              country = data?.[0];
              if (country) {
                console.log("✅ Fant landdata for:", variant);
                break;
              }
            }
          } catch (err) {
            console.log("❌ Variant feilet:", variant, err);
            continue;
          }
        }

        if (!country) {
          throw new Error(`Kunne ikke finne data for ${name}`);
        }

        console.log("🏁 Landdata hentet:", country.name.common);

        const encodedCountryName = encodeURIComponent(country.name.common);

        const popupContent = `
          <div style="max-width: 280px; font-size: 13px; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <img src="${country.flags.svg}" 
                 alt="Flagg" 
                 style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;" 
                 onerror="this.style.display='none'" />
            
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2c3e50; text-align: center; font-weight: 600;">
              ${country.name.common}
            </h3>
            
            <div style="margin-bottom: 8px;">
              <strong>🌍 Region:</strong> ${country.region}${country.subregion ? ` – ${country.subregion}` : ''}
            </div>
            
            <div style="margin-bottom: 8px;">
              <strong>🏛️ Hovedstad:</strong> ${country.capital?.[0] ?? "Ukjent"}
            </div>
            
            <div style="margin-bottom: 8px;">
              <strong>👥 Befolkning:</strong> ${country.population?.toLocaleString() ?? "Ukjent"}
            </div>
            
            <div style="margin-bottom: 8px;">
              <strong>🗣️ Språk:</strong> ${country.languages ? Object.values(country.languages).slice(0, 3).join(", ") : "Ukjent"}
            </div>
            
            <div style="margin-bottom: 12px;">
              <strong>💰 Valuta:</strong> ${country.currencies ? Object.values(country.currencies).map((c: any) => c.name).slice(0, 2).join(", ") : "Ukjent"}
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
              <a href="/countries/${encodedCountryName}" 
              target="_blank"
                 style="
                   color: white; 
                   background: linear-gradient(135deg, #e6955e, #d4804a);
                   text-decoration: none; 
                   font-weight: 600; 
                   padding: 8px 16px; 
                   border-radius: 6px; 
                   display: inline-block;
                   transition: all 0.3s ease;
                   box-shadow: 0 2px 8px rgba(230,149,94,0.3);
                 "
                 onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(230,149,94,0.4)';"
                 onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 2px 8px rgba(230,149,94,0.3)';">
                Se detaljert side
              </a>
            </div>
          </div>
        `;

        layer.bindPopup(popupContent, {
          maxWidth: 320,
          className: 'country-popup'
        }).openPopup();

        console.log("✅ Popup vist for:", country.name.common);

      } catch (error) {
        console.error("❌ Feil ved henting av landdata:", error);
        
        const errorPopup = `
          <div style="text-align: center; padding: 15px; color: #d32f2f;">
            <div style="font-size: 16px; margin-bottom: 8px;">⚠️</div>
            <div style="margin-bottom: 8px;"><strong>Kunne ikke laste informasjon om ${name}</strong></div>
            <div style="font-size: 12px; color: #666;">
              Prøv å klikke på et annet land eller 
              <a href="/countries" style="color: #0074d9;">gå til landoversikten</a>
            </div>
          </div>
        `;
        
        layer.bindPopup(errorPopup, {
          maxWidth: 250,
          className: 'error-popup'
        }).openPopup();
      }
    });

    // Enkel tooltip
    layer.bindTooltip(name, {
      permanent: false,
      direction: "auto",
      className: "country-tooltip",
    });

    console.log("✅ Event listeners lagt til for:", name);
  };

  // Loading state
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
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Prøv igjen
          </button>
        </div>
      </main>
    );
  }

  console.log("🗺️ Renderer kart med", geoData.features?.length, "land");

  return (
    <main className="h-screen w-screen overflow-hidden">
      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        attributionControl={true}
        zoomControl={true}
      >
        <TileLayer 
          url=""
          attribution=''
        />
        <GeoJSON
          key={`geojson-${Date.now()}`} // Force refresh
          data={geoData}
          style={() => countryStyle}
          onEachFeature={onEachCountry}
        />
      </MapContainer>

      <style jsx global>{`
        .country-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 6px 10px !important;
          font-size: 12px !important;
          font-weight: bold !important;
        }

        .country-popup .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }

        .country-popup .leaflet-popup-content {
          margin: 15px !important;
        }

        .loading-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          background-color: #f0f8ff !important;
        }

        .error-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          background-color: #ffe6e6 !important;
        }

        .leaflet-container {
          cursor: crosshair !important;
        }

        .leaflet-interactive {
          cursor: pointer !important;
        }

        .leaflet-popup-close-button {
          color: #666 !important;
          font-size: 18px !important;
          font-weight: bold !important;
        }

        .leaflet-popup-close-button:hover {
          color: #000 !important;
        }

        /* Sørg for at GeoJSON lag kan motta klikk */
        .leaflet-overlay-pane svg {
          pointer-events: auto !important;
        }

        .leaflet-overlay-pane path {
          pointer-events: auto !important;
        }

        /* Fjern default Leaflet outline på klikk */
        .leaflet-interactive:focus {
          outline: none !important;
        }

        /* Fjern blå ramme ved klikk */
        .leaflet-overlay-pane path:focus {
          outline: none !important;
        }
      `}</style>
    </main>
  );
}