"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PrismaClient } from '@prisma/client';

interface Trial {
    trial: number;
    delay: number;
    reactionTime: number;
}

export default function Trial() {
    const [showBox, setShowBox] = useState<boolean>(false);
    const router = useRouter();

    const objectStartTimeRef = useRef<number>(0);
    const timerRef = useRef<number>(0);
    const intervalTimingsRef = useRef<number[]>([]);
    const trialArrRef = useRef<Trial[]>([]);
    const randomTimeMsRef = useRef<number>(0);
    const trialNumRef = useRef<number>(0);

    useEffect(() => {
        // clear any current timers
        clearTimeout(timerRef.current);

        trialArrRef.current = [];
        trialNumRef.current = 0;
        intervalTimingsRef.current = [];

        // create timing intervals
        // 1 to 15 secs half ms intervals
        // for (let i = 0; i < 3; i++) {
        //     for (let j = 1000; j <= 15000; j += 500) {
        //         intervalTimingsRef.current.push(j);
        //     }
        // }

        // testing purposes only
        for (let j = 1000; j <= 5000; j += 500) {
            intervalTimingsRef.current.push(j);
        }

        let sum = 0;
        intervalTimingsRef.current.forEach(t => {
            sum += t;
        });

        console.log('total ms %d', sum);

        startNextTrial();
        return () => clearTimeout(timerRef.current);
    }, []); // runs on mount []

    async function handleReactionClick() {
        if (!showBox) return;

        setShowBox(false);

        const reactionTime =
            performance.now() - objectStartTimeRef.current;


        let trial: Trial = {
            trial: trialNumRef.current,
            delay: randomTimeMsRef.current,
            reactionTime
        }

        trialArrRef.current.push(trial);

        await fetch("/api/trials", {
            method: "POST",
            body: JSON.stringify({
                trialNumber: trialNumRef.current,
                delayMs: randomTimeMsRef.current,
                reactionTimeMs: reactionTime,
            }),
        });

        if (intervalTimingsRef.current.length === 0) {
            console.log(trialArrRef.current);
            router.push("/trialEnd");
            return;
        }
        console.log('Trial %d reaction times %d ms', trialNumRef.current, reactionTime);
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
        randomTimeMsRef.current =
            intervalTimingsRef.current[randomIndex];
        intervalTimingsRef.current.splice(randomIndex, 1);

        console.log('Box appearing in %d ms', randomTimeMsRef.current);
        timerRef.current = window.setTimeout(startTrial, randomTimeMsRef.current);
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

            {/* Instruction */}
            <p className="mt-8 text-xs text-stone-400">
                Click the box as soon as it appears
            </p>
        </div>
    );
}
