'use client';

import { useEffect, useRef, useState } from 'react';

interface CountryMapProps {
  country: {
    name: { common: string };
    latlng?: [number, number];
    cca3: string;
  };
}

export default function CountryMap({ country }: CountryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Sørg for at komponenten kun kjører på klienten
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamisk import av Leaflet kun på klienten
    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Sett opp default ikoner
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Rydd opp eksisterende kart
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Standard koordinater (Europa)
        const defaultLat = 54.5;
        const defaultLng = 15.0;
        const defaultZoom = 4;

        // Bruk landets koordinater hvis tilgjengelig
        const lat = country.latlng?.[0] ?? defaultLat;
        const lng = country.latlng?.[1] ?? defaultLng;
        const zoom = country.latlng ? 6 : defaultZoom;

        // Opprett kart
        const map = L.map(mapRef.current!).setView([lat, lng], zoom);
        mapInstanceRef.current = map;

        // Legg til bakgrunnskart
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Hent og vis landegrenser
        const fetchCountryBoundaries = async () => {
          try {
            // Prøv først med cca3 kode
            const geoJsonUrl = `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson`;
            
            const response = await fetch(geoJsonUrl);
            const worldData = await response.json();
            
            // Finn det spesifikke landet
            const countryFeature = worldData.features.find((feature: any) => 
              feature.properties.ISO_A3 === country.cca3 ||
              feature.properties.NAME === country.name.common ||
              feature.properties.NAME_LONG === country.name.common
            );

            if (countryFeature) {
              // Legg til landets grenser med oransje farge
              const countryLayer = L.geoJSON(countryFeature, {
                style: {
                  color: '#ff6b35',
                  weight: 3,
                  fillColor: '#ff6b35',
                  fillOpacity: 0.3
                }
              }).addTo(map);

              // Zoom til landets grenser
              map.fitBounds(countryLayer.getBounds(), { padding: [20, 20] });
            } else {
              // Fallback: legg til en markør
              L.marker([lat, lng])
                .addTo(map)
                .bindPopup(country.name.common)
                .openPopup();
            }
          } catch (error) {
            console.error('Kunne ikke laste landegrenser:', error);
            // Fallback: legg til en markør
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(country.name.common)
              .openPopup();
          }
        };

        fetchCountryBoundaries();
      } catch (error) {
        console.error('Kunne ikke initialisere kart:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, country]);

  // Vis loading mens vi venter på at klienten skal laste
  if (!isClient) {
    return (
      <div className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-gray-600 dark:text-gray-400">Laster kart...</div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600"
      style={{ minHeight: '384px' }}
    />
  );
}