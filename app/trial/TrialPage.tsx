
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Trial data type
interface Trial {
  trial: number;
  delay: number;
  reactionTime: number;
  userId: number;
}

export default function TrialClient() {
  const [showBox, setShowBox] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const objectStartTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const intervalTimingsRef = useRef<number[]>([]);
  const trialArrRef = useRef<Trial[]>([]);
  const randomTimeMsRef = useRef(0);
  const trialNumRef = useRef(0);

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
      console.error("No userId provided. Redirecting home.");
      router.push("/");
    }
  }, [userId, router]);

  // Initialize trials
  useEffect(() => {
    if (!userId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    trialArrRef.current = [];
    trialNumRef.current = 0;
    intervalTimingsRef.current = [];

    // 1–5s in 500ms steps
    for (let ms = 1000; ms <= 5000; ms += 500) {
      intervalTimingsRef.current.push(ms);
    }

    startNextTrial();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userId]);

  function startTrial() {
    objectStartTimeRef.current = performance.now();
    trialNumRef.current += 1;
    setShowBox(true);
  }

  function startNextTrial() {
    const i = Math.floor(Math.random() * intervalTimingsRef.current.length);
    randomTimeMsRef.current = intervalTimingsRef.current[i];
    intervalTimingsRef.current.splice(i, 1);

    timerRef.current = window.setTimeout(startTrial, randomTimeMsRef.current);
  }

  async function handleReactionClick() {
    if (!showBox || !userId) return;

    setShowBox(false);

    const reactionTime =
      performance.now() - objectStartTimeRef.current;

    const trial: Trial = {
      trial: trialNumRef.current,
      delay: randomTimeMsRef.current,
      reactionTime,
      userId: Number(userId),
    };

    trialArrRef.current.push(trial);

    try {
      await fetch("/api/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: trial.userId,
          trialNumber: trial.trial,
          delayMs: trial.delay,
          reactionTimeMs: trial.reactionTime,
        }),
      });
    } catch (err) {
      console.error("Failed to send trial:", err);
    }

    if (intervalTimingsRef.current.length === 0) {
      console.log("Trials complete:", trialArrRef.current);
      router.push("/trialEnd");
      return;
    }

    startNextTrial();
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Missing userId… redirecting
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 text-stone-800">
      <p className="mb-8 text-sm tracking-wide text-stone-500">
        Trial {trialNumRef.current + 1}
      </p>

      <div
        onClick={handleReactionClick}
        className="flex h-64 w-64 items-center justify-center"
      >
        {showBox ? (
          <div className="h-40 w-40 cursor-pointer bg-black transition-colors hover:bg-stone-800" />
        ) : (
          <div className="h-40 w-40 border border-dashed border-stone-300" />
        )}
      </div>
    </div>
  );
}
