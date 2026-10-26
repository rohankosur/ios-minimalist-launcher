"use client";

import { useEffect, useState } from "react";

export default function PWAClientManager() {
  const [isStandalone, setIsStandalone] = useState<boolean>(true);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Register service worker for instant ignition and offline caching
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      });
    }

    // Check iOS standalone mode or standard PWA display-mode
    const checkStandalone = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isIosStandalone = (window.navigator as any).standalone === true;
      const isDisplayStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const standalone = isIosStandalone || isDisplayStandalone;
      setIsStandalone(standalone);
      if (!standalone) {
        setShowPrompt(true);
      }
    };

    checkStandalone();
  }, []);

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="w-full px-6 mb-2 pointer-events-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/10 text-xs text-white/80">
        <div className="flex items-center gap-2 lowercase font-medium">
          <span className="text-sm">⎋</span>
          <span>tap share &apos;add to home screen&apos; for chrome-free pwa</span>
        </div>
        <button
          type="button"
          onClick={() => setShowPrompt(false)}
          className="text-white/40 hover:text-white px-1.5 py-0.5 text-xs font-mono lowercase"
        >
          dismiss
        </button>
      </div>
    </div>
  );
}
