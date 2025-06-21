import Navbar from "@/app/components/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Hei! Jeg heter [Ditt Navn]</h1>
        <p className="text-lg text-gray-700 mb-6">
          Jeg er en informatikkstudent ved [navn på universitetet], og nå ferdig med mitt andre år.
          Jeg interesserer meg for webutvikling, frontend, AI og hvordan teknologi kan løse ekte problemer.
        </p>
        <p className="text-md text-gray-600">
          Denne nettsiden er laget for å vise hva jeg kan – og for å dele noen prosjekter jeg har jobbet med
          underveis i utdanningen og på fritiden.
        </p>
      </div>
    </main>
  );
}
