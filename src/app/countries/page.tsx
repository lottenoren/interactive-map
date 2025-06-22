import { getAllCountries } from "@/lib/getCountries";
import Link from "next/link";

export default async function CountriesPage() {
  const countries = await getAllCountries();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Utforsk land</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {countries.map((country: any) => (
          <Link
            key={country.name.common}
            href={`/countries/${encodeURIComponent(country.name.common)}`}
            className="border p-4 rounded hover:shadow cursor-pointer"
          >
            <img src={country.flags.svg} alt={country.name.common} className="h-24 w-full object-cover mb-2" />
            <h2 className="font-semibold">{country.name.common}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
