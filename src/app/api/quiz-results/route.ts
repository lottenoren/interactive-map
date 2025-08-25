// src/app/api/quiz-results/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { level, score, total, durationMs, answers } = body ?? {};

  if (
    typeof level !== "string" ||
    typeof score !== "number" ||
    typeof total !== "number"
  ) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  // finn bruker-id
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const result = await prisma.quizResult.create({
    data: {
      userId: user.id,
      level,
      score,
      total,
      durationMs: durationMs ?? null,
      answers: answers ?? null,
    },
  });

  return NextResponse.json({ ok: true, result });
}

export async function GET() {
  // returner siste 20 for innlogget bruker
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const results = await prisma.quizResult.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ results });
}

