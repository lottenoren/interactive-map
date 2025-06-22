// src/app/countries/[name]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CountryPage({ params }: { params: Promise<{ name: string }> }) {
    // Await params først
    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    
    const res = await fetch(`https://restcountries.com/v3.1/name/${decodedName}?fullText=true`);
  
    if (!res.ok) {
      notFound(); // Bedre håndtering
    }
  
    const data = await res.json();
    const country = data?.[0];
  
    if (!country) {
      notFound();
    }

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* Tilbake-knapp */}
      <Link
        href="/countries"
        className="inline-block text-[rgb(0,116,217)] hover:font-semibold text-lg"> ← Tilbake til oversikt
      </Link>

      {/* Grid layout */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <img
          src={country.flags.svg}
          alt={`Flagg for ${country.name.common}`}
          className="w-full max-w-md rounded shawdow-md"
        />

        {/* Informasjon */}
        <div className="prose prose-lg dark:prose-invert space-y-3">
          <h1 className="text-4xl font-bold mb-4">{country.name.common}</h1>
          <p>
            <strong>Region:</strong> {country.region} – {country.subregion}
          </p>
          <p>
            <strong>Hovedstad:</strong> {country.capital?.[0] ?? "Ukjent"}
          </p>
          <p>
            <strong>Befolkning:</strong> {country.population.toLocaleString()}
          </p>
          <p>
            <strong>Språk:</strong>{" "}
            {country.languages ? Object.values(country.languages).join(", ") : "Ukjent"}
          </p>
          <p>
            <strong>Valuta:</strong>{" "}
            {country.currencies
              ? Object.values(country.currencies)
                  .map((c: any) => c.name)
                  .join(", ")
              : "Ukjent"}
          </p>
          <p>
            <strong>Tidssoner:</strong> {country.timezones?.join(", ")}
          </p>

          {country.maps?.googleMaps && (
            <p>
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(0,116,217)] hover:underline"
              >
                Åpne i Google Maps
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
