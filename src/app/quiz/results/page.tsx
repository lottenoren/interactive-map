// src/app/quiz/results/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { QuizResult } from "@prisma/client";

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Resultater</h1>
        <p className="text-gray-600 mb-4">Du må være logget inn for å se dine resultater.</p>
        <Link href="/quiz" className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
          Gå til quiz
        </Link>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return <div className="p-8">Bruker ikke funnet.</div>;
  }

  const results = await prisma.quizResult.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50, // hent siste 50
  });

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dine Resultater fra Quiz!</h1>

      {results.length === 0 ? (
        <p className="text-gray-600">Du har ingen lagrede resultater ennå.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Dato</th>
                <th className="px-4 py-2">Nivå</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Tid brukt</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r: QuizResult) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString("no-NO")}</td>
                  <td className="px-4 py-2 capitalize">
                    {r.level === "easy" ? "Lett" : r.level === "medium" ? "Medium" : "Vanskelig"}
                  </td>
                  <td className="px-4 py-2">
                    {r.score} / {r.total}
                  </td>
                  <td className="px-4 py-2">
                    {r.durationMs ? `${Math.round(r.durationMs / 1000)} sek` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link href="/quiz" className="text-blue-600 hover:underline">
          ← Tilbake til quiz
        </Link>
      </div>
    </main>
  );
}
