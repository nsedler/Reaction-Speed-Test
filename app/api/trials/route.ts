import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  const data = await req.json();
  const trial = await prisma.trial.create({
    data: {
      trialNumber: data.trialNumber,
      delayMs: data.delayMs,
      reactionTimeMs: data.reactionTimeMs,
    },
  });
  return NextResponse.json(trial);
}

export async function GET() {
  const trials = await prisma.trial.findMany();
  return NextResponse.json(trials);
}
