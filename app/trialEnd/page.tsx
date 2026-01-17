"use client";

import { useRouter } from "next/navigation";

export default function TrialEnd() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
            <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-4 text-3xl font-semibold text-stone-900">
                    Test Complete
                </h1>

                <p className="mb-6 text-sm leading-relaxed text-stone-600">
                    Thanks for participating in the reaction speed test.
                    Your responses have been successfully recorded.
                </p>

                <div className="mb-6 text-xs text-stone-400">
                    You may now safely close this page
                </div>

                <button
                    onClick={() => router.push("/")}
                    className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                    Run Again
                </button>
            </div>
        </div>
    );
}
