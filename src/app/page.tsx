// src/app/page.tsx
export default function Home() {
    return (
        <main className="flex min-h-screen justify-center items-start pt-28 md:pt-36">
        <section className="max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Utforsk verden!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Denne nettsiden samler interaktivt kart, landinformasjon og en liten flaggquiz hvor du kan teste din egen kunnskap. 
            Bygget i Next.js og Tailwind.
          </p>
      
          <div className="mt-8 flex flex-wrap justify-start gap-3">
            <a
              href="/countries"
              className="inline-flex items-center justify-center rounded-xl border border-blue-300 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
            >
              Utforsk land
            </a>
            <a
              href="/map"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Åpne kart
            </a>
            <a
              href="/quiz"
              className="inline-flex items-center justify-center rounded-xl border border-orange-300 px-5 py-3 font-semibold text-orange-600 hover:bg-orange-50 transition"
            >
              Ta quiz
            </a>
          </div>
        </section>
      </main>
    );
  }
  