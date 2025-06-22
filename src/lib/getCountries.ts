export async function getAllCountries() {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,currencies,languages,population",
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // unngår cacheproblemer
      }
    );
  
    if (!res.ok) throw new Error("Kunne ikke hente land.");
    return res.json();
  }
  