import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// POST /api/trials
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, trialNumber, delayMs, reactionTimeMs } = data;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const trial = await prisma.trial.create({
      data: {
        user: { connect: { id: Number(userId) } }, // Connect to existing user
        trialNumber: Number(trialNumber),
        delayMs: Number(delayMs),
        reactionTimeMs: Number(reactionTimeMs),
      },
    });

    return NextResponse.json(trial, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create trial" }, { status: 500 });
  }
}

// GET /api/trials
export async function GET() {
  try {
    const trials = await prisma.trial.findMany({
      include: { user: true }, // optionally include user info
    });
    return NextResponse.json(trials);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch trials" }, { status: 500 });
  }
}

