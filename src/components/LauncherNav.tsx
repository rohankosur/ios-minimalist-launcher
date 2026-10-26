"use client";

import { useState } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { FocusMode } from "@/types/launcher";

const FOCUS_MODES: { mode: FocusMode; label: string }[] = [
  { mode: "all", label: "all" },
  { mode: "essential", label: "essential" },
  { mode: "focus", label: "focus" },
  { mode: "personal", label: "personal" },
];

export default function LauncherNav() {
  const {
    apps,
    setActiveWidgetId,
    setIsCustomizing,
    settings,
    setFocusMode,
    setPendingMindfulApp,
    recordAppOpen,
    setIsSearchOpen,
  } = useLauncher();

  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);

  // Filter apps based on active dumb phone focus mode
  const visibleApps = apps.filter((app) => {
    if (!app.enabled) return false;
    if (settings.activeMode === "all") return true;
    return !app.modes || app.modes.includes(settings.activeMode);
  });

  const handleRouteClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    route: (typeof apps)[0]
  ) => {
    // Check if Mindful Friction Delay is triggered
    if (route.mindfulDelay || settings.globalMindfulDelay) {
      e.preventDefault();
      setPendingMindfulApp(route);
      return;
    }

    recordAppOpen();

    // Tactile haptic feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    // Focus this app's widget on top
    setActiveWidgetId(route.id);

    setActiveFeedback(`${route.label} ➔ ${route.scheme}`);
    setTimeout(() => {
      setActiveFeedback((current) =>
        current === `${route.label} ➔ ${route.scheme}` ? null : current
      );
    }, 2800);
  };

  // Text alignment helper
  const alignmentClass =
    settings.textAlignment === "center"
      ? "items-center text-center justify-center"
      : settings.textAlignment === "right"
      ? "items-end text-right justify-end"
      : "items-start text-left justify-between";

  return (
    <section
      aria-label="App Launcher Navigation"
      className="w-full flex flex-col justify-end pointer-events-auto"
    >
      {/* Active Route Telemetry Toast */}
      {activeFeedback && (
        <div className="mx-6 mb-3 flex items-center justify-between rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="font-mono tracking-tight lowercase">{activeFeedback}</span>
          <span className="text-[10px] tracking-widest text-emerald-400 uppercase font-mono">
            dispatched
          </span>
        </div>
      )}

      {/* 
        Main Navigation Block
        Parameters:
        - CSS glassmorphism effect
        - Translucent deep blue: rgba(5, 15, 45, 0.4)
        - 20px backdrop-filter: blur
        - Shear away all borders (border: none !important)
        - Welded seamlessly into starry space wallpaper
        - Anchored in lower half of viewport
      */}
      <nav
        className="w-full rounded-t-[36px] sm:rounded-[36px] p-6 sm:p-8 flex flex-col justify-between"
        style={{
          backgroundColor: "rgba(5, 15, 45, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
      >
        {/* Contextual Focus Mode Selector (Copied from Dumb Phone by Michael Tigas) */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            {FOCUS_MODES.map((fm) => (
              <button
                key={fm.mode}
                type="button"
                onClick={() => setFocusMode(fm.mode)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono lowercase transition-all ${
                  settings.activeMode === fm.mode
                    ? "bg-white/20 text-white font-bold"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {fm.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="text-[11px] font-mono text-white/50 hover:text-white lowercase flex items-center gap-1"
          >
            <span>search (a-z)</span>
          </button>
        </div>

        {/* Kinetic Route Links: heavy, lowercase, SF Pro sans-serif, pure white */}
        <div className="flex flex-col gap-1 sm:gap-2">
          {visibleApps.map((route) => (
            <a
              key={route.id}
              href={route.scheme}
              onClick={(e) => handleRouteClick(e, route)}
              className={`group flex ${alignmentClass} py-2 sm:py-2.5 px-3 rounded-2xl transition-all duration-150 active:opacity-35 active:scale-[0.985] -webkit-touch-callout-none select-none`}
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {/* Heavy, lowercase, pure white typography */}
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white lowercase group-hover:translate-x-1 transition-transform duration-200">
                  {route.label}
                </span>
                {route.mindfulDelay && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                    pause
                  </span>
                )}
              </div>

              {/* Minimalist target URI indicator (hidden if center-aligned) */}
              {settings.textAlignment === "left" && (
                <span className="font-mono text-xs text-white/30 lowercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                  {route.scheme}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Minimalist bottom bar with customize trigger and diagnostics */}
        <div className="mt-5 pt-4 flex items-center justify-between text-xs text-white/40 border-t border-white/5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCustomizing(true)}
              className="flex items-center gap-1.5 text-white/70 hover:text-white active:scale-95 transition-all lowercase font-bold bg-white/10 px-2.5 py-1 rounded-full"
            >
              <span>⚙ customize launcher</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInspector(!showInspector)}
              className="hover:text-white/80 active:opacity-40 transition-colors lowercase font-medium hidden sm:inline"
            >
              {showInspector ? "hide routes" : `routes (${visibleApps.length})`}
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-white/40 lowercase">
            <span>{settings.dailyOpensCount} opens today</span>
          </div>
        </div>

        {/* Expandable Scheme Diagnostics Table */}
        {showInspector && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2 text-xs font-mono text-white/70 animate-in fade-in duration-200">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-sans font-semibold mb-1">
              Active Kinetic Kernel Bindings ({settings.activeMode} mode)
            </div>
            {visibleApps.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{r.label}</span>
                  <span className="text-white/40 text-[10px]">
                    ({r.widget.type})
                  </span>
                </div>
                <code className="text-emerald-400 text-[11px]">{r.scheme}</code>
              </div>
            ))}
          </div>
        )}
      </nav>
    </section>
  );
}
