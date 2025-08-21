// src/app/countries/[name]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import CountryMap from "./countryMap";

export const dynamic = 'force-dynamic';

export default async function CountryPage({ params }: { params: { name: string } }) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto p-6">
        {/* Tilbake-knapp */}
        <div className="mb-8">
          <Link
            href="/countries"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tilbake til oversikt
          </Link>
        </div>

        {/* Hovedinnhold */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Venstre kolonne - Flagg, navn og grunnleggende info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Flagg og tittel i egen boks */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-4">
                <img
                  src={country.flags.svg}
                  alt={`Flagg for ${country.name.common}`}
                  className="w-16 h-12 object-contain rounded shadow-sm flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {country.name.common}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">
                    {country.name.official}
                  </p>
                </div>
              </div>
            </div>

            {/* Grunnleggende informasjon */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Grunnleggende informasjon
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Region</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {country.region} – {country.subregion}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Hovedstad</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {country.capital?.[0] ?? "Ukjent"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Befolkning</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {country.population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Høyre kolonne - Detaljert informasjon og kart */}
          <div className="xl:col-span-2 space-y-6">
            {/* Detaljert informasjon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Språk og kultur */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Språk og kultur
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Språk</span>
                    <span className="text-gray-900 dark:text-white">
                      {country.languages ? Object.values(country.languages).join(", ") : "Ukjent"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Økonomi */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Økonomi
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Valuta</span>
                    <span className="text-gray-900 dark:text-white">
                      {country.currencies
                        ? Object.values(country.currencies)
                            .map((c: any) => c.name)
                            .join(", ")
                        : "Ukjent"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tidssoner */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Tidssoner
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Tidssoner</span>
                    <span className="text-gray-900 dark:text-white">
                      {country.timezones?.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eksterne lenker */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Eksterne lenker
                </h3>
                <div className="space-y-3">
                  {country.maps?.googleMaps && (
                    <a
                      href={country.maps.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Åpne i Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Kart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Geografisk plassering
                </h2>
              </div>
              <div className="p-6">
                <CountryMap country={country} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}