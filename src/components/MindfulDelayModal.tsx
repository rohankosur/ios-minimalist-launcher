"use client";

import React, { useEffect, useState } from "react";
import { useLauncher } from "@/context/LauncherContext";

export default function MindfulDelayModal() {
  const { pendingMindfulApp, setPendingMindfulApp, settings, recordAppOpen } = useLauncher();
  const [countdown, setCountdown] = useState<number>(settings.mindfulDelaySeconds || 4);

  useEffect(() => {
    if (!pendingMindfulApp) {
      setCountdown(settings.mindfulDelaySeconds || 4);
      return;
    }

    setCountdown(settings.mindfulDelaySeconds || 4);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingMindfulApp, settings.mindfulDelaySeconds]);

  if (!pendingMindfulApp) return null;

  const handleProceed = () => {
    recordAppOpen();
    const scheme = pendingMindfulApp.scheme;
    setPendingMindfulApp(null);
    window.location.href = scheme;
  };

  const handleCancel = () => {
    setPendingMindfulApp(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300"
      style={{
        backgroundColor: "rgba(3, 7, 24, 0.92)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
      }}
    >
      {/* Mindful Breathing Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-25" />
        <div className="w-28 h-28 rounded-full bg-white/[0.08] backdrop-blur-xl flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-mono tracking-tight text-white">
            {countdown > 0 ? countdown : "✓"}
          </span>
          <span className="text-[10px] text-white/50 tracking-widest uppercase font-mono mt-1">
            {countdown > 0 ? "pause" : "ready"}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-black lowercase tracking-tight mb-2">
        pause &amp; breathe
      </h2>
      <p className="text-sm text-white/60 lowercase max-w-xs mb-8">
        are you opening <span className="font-bold text-white">&quot;{pendingMindfulApp.label}&quot;</span> with intention, or by reflex?
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3.5 rounded-2xl bg-white text-[#050f2d] font-extrabold text-sm lowercase active:scale-[0.98] transition-all shadow-lg"
        >
          stay mindful (cancel)
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className={`w-full py-3 rounded-2xl border border-white/20 text-xs font-bold lowercase transition-all ${
            countdown === 0
              ? "bg-white/15 text-white hover:bg-white/25 active:scale-[0.98]"
              : "opacity-40 text-white/40 cursor-not-allowed"
          }`}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `proceed in ${countdown}s...` : `proceed to ${pendingMindfulApp.label}`}
        </button>
      </div>
    </div>
  );
}
