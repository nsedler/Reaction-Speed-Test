"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";

export default function Home() {
  const [understood, setUnderstood] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!understood) return;
    router.push("/about");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-200 p-4">
      <main className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold text-stone-800">
          Sedler-Guy Reaction Speed Test
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-stone-600">
          This is a reaction speed test. Once you hit start, an object will
          appear after a random delay between <strong>1 and 15 seconds</strong>.
          Click the object as quickly as you can. The object will appear multiple
          times—try your best until the completion screen appears.
        </p>

        <label className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="h-4 w-4 accent-stone-800"
          />
          <span>I understand</span>
        </label>

        <Button
          onClick={handleSubmit}
          disabled={!understood}
        >
          Start Test
        </Button>
      </main>
    </div>
  );
}
