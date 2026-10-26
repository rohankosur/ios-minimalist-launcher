"use client";

import React, { useEffect, useState } from "react";
import { useLauncher } from "@/context/LauncherContext";

export default function MindfulDelayModal() {
  const { pendingMindfulApp, setPendingMindfulApp, settings, recordAppOpen } = useLauncher();
  const totalSeconds = settings.mindfulDelaySeconds || 4;
  const [countdown, setCountdown] = useState<number>(totalSeconds);

  useEffect(() => {
    if (!pendingMindfulApp) {
      setCountdown(totalSeconds);
      return;
    }

    setCountdown(totalSeconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Haptic tick when intentional reflection is complete
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            try {
              navigator.vibrate([20, 50, 20]);
            } catch {}
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPendingMindfulApp(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pendingMindfulApp, totalSeconds, setPendingMindfulApp]);

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

  // SVG circular countdown progress
  const progressPercent = (countdown / totalSeconds) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleCancel}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300 select-none cursor-pointer"
      style={{
        backgroundColor: "rgba(3, 7, 24, 0.94)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm flex flex-col items-center cursor-default"
      >
        {/* Mindful Breathing SVG Progress Ring */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Central Pulse Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black font-mono tracking-tight text-white">
              {countdown > 0 ? countdown : "✓"}
            </span>
            <span className="text-[10px] text-white/50 tracking-widest uppercase font-mono mt-0.5">
              {countdown > 0 ? "pause" : "ready"}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-black lowercase tracking-tight mb-2">
          pause &amp; breathe
        </h2>
        <p className="text-sm text-white/60 lowercase max-w-xs mb-8 leading-relaxed">
          are you opening <span className="font-bold text-white">&quot;{pendingMindfulApp.label}&quot;</span> with intention, or by reflex?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
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
            className={`w-full py-3 rounded-2xl border text-xs font-bold lowercase transition-all ${
              countdown === 0
                ? "border-emerald-400 bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400/30 active:scale-[0.98] shadow-md animate-pulse"
                : "border-white/10 opacity-30 text-white/40 cursor-not-allowed"
            }`}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `proceed in ${countdown}s...` : `proceed to ${pendingMindfulApp.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
