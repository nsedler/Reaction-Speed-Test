"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Define a trial type that includes the user
interface Trial {
  trial: number;
  delay: number;
  reactionTime: number;
  userId: number; // associate each trial with a user
}

export default function Trial() {
  const [showBox, setShowBox] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // get userId from query string

  const objectStartTimeRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const intervalTimingsRef = useRef<number[]>([]);
  const trialArrRef = useRef<Trial[]>([]);
  const randomTimeMsRef = useRef<number>(0);
  const trialNumRef = useRef<number>(0);

  // Redirect to home if no userId
  useEffect(() => {
    if (!userId) {
      console.error("No userId provided in query. Redirecting to home.");
      router.push("/");
    }
  }, [userId, router]);

  useEffect(() => {
    if (!userId) return;

    // clear any existing timers
    clearTimeout(timerRef.current);

    trialArrRef.current = [];
    trialNumRef.current = 0;
    intervalTimingsRef.current = [];

    // Generate intervals for testing (1–5s with 500ms steps)
    for (let j = 1000; j <= 5000; j += 500) {
      intervalTimingsRef.current.push(j);
    }

    let sum = intervalTimingsRef.current.reduce((acc, t) => acc + t, 0);
    console.log("total ms %d", sum);

    startNextTrial();

    return () => clearTimeout(timerRef.current);
  }, [userId]);

  async function handleReactionClick() {
    if (!showBox || !userId) return;

    setShowBox(false);

    const reactionTime = performance.now() - objectStartTimeRef.current;

    // Save trial locally with userId
    const trial: Trial = {
      trial: trialNumRef.current,
      delay: randomTimeMsRef.current,
      reactionTime,
      userId: Number(userId),
    };
    trialArrRef.current.push(trial);

    // POST trial to API
    try {
      await fetch("/api/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          trialNumber: trial.trial,
          delayMs: trial.delay,
          reactionTimeMs: trial.reactionTime,
        }),
      });
    } catch (err) {
      console.error("Failed to send trial:", err);
    }

    if (intervalTimingsRef.current.length === 0) {
      console.log("All trials completed:", trialArrRef.current);
      router.push("/trialEnd");
      return;
    }

    console.log(
      "Trial %d reaction time %d ms",
      trial.trial,
      trial.reactionTime
    );
    startNextTrial();
  }

  function startTrial() {
    objectStartTimeRef.current = performance.now();
    trialNumRef.current += 1;
    setShowBox(true);
  }

  function startNextTrial() {
    const randomIndex = Math.floor(
      Math.random() * intervalTimingsRef.current.length
    );
    randomTimeMsRef.current = intervalTimingsRef.current[randomIndex];
    intervalTimingsRef.current.splice(randomIndex, 1);

    console.log("Box appearing in %d ms", randomTimeMsRef.current);
    timerRef.current = window.setTimeout(startTrial, randomTimeMsRef.current);
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Missing userId… redirecting to home
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 text-stone-800">
      {/* Trial counter */}
      <p className="mb-8 text-sm tracking-wide text-stone-500">
        Trial {trialNumRef.current + 1}
      </p>

      {/* Interaction area */}
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

