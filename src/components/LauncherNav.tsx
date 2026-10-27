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
    setIsAppDirectoryOpen,
    toggleOledMode,
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

  // Dynamic typography scale
  const fontClass =
    settings.fontSize === "compact"
      ? "text-2xl sm:text-3xl"
      : settings.fontSize === "large"
      ? "text-4xl sm:text-5xl"
      : "text-3xl sm:text-4xl";

  return (
    <section
      aria-label="App Launcher Navigation"
      className="w-full flex flex-col justify-end pointer-events-auto select-none"
    >
      {/* Active Route Telemetry Toast */}
      {activeFeedback && (
        <div className="mx-5 mb-2.5 flex items-center justify-between rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/95 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2">
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
        - Shear away all borders
        - Welded seamlessly into starry space wallpaper
        - Anchored in lower half of viewport
      */}
      <nav
        className="w-full rounded-t-[32px] sm:rounded-t-[36px] px-5 pt-4 pb-4 sm:p-6 flex flex-col justify-between"
        style={{
          backgroundColor: settings.oledMode ? "rgba(0, 0, 0, 0.92)" : "rgba(5, 15, 45, 0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          outline: "none",
          boxShadow: "none",
        }}
      >
        {/* Contextual Focus Mode Selector & Quick Actions */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {FOCUS_MODES.map((fm) => (
              <button
                key={fm.mode}
                type="button"
                onClick={() => setFocusMode(fm.mode)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono lowercase transition-all shrink-0 ${
                  settings.activeMode === fm.mode
                    ? "bg-white text-[#050f2d] font-bold shadow-sm"
                    : "text-white/50 hover:text-white/80 active:bg-white/10"
                }`}
              >
                {fm.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* OLED Mode Quick Toggle */}
            <button
              type="button"
              onClick={toggleOledMode}
              title={settings.oledMode ? "Disable OLED Black Mode" : "Enable OLED Black Mode"}
              className={`p-1 rounded-full text-xs transition-colors ${
                settings.oledMode ? "text-amber-300 bg-amber-400/20" : "text-white/40 hover:text-white"
              }`}
            >
              {settings.oledMode ? "✦" : "☾"}
            </button>

            {/* Searchable App Directory Trigger */}
            <button
              type="button"
              onClick={() => setIsAppDirectoryOpen(true)}
              className="text-[11px] font-mono text-emerald-300 hover:text-white lowercase flex items-center gap-1 bg-emerald-400/20 hover:bg-emerald-400/30 px-2 py-0.5 rounded-full transition-all font-semibold"
            >
              <span>+ apps</span>
            </button>

            {/* A-Z Search Drawer Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-[11px] font-mono text-white/60 hover:text-white lowercase flex items-center gap-1 bg-white/[0.06] hover:bg-white/10 px-2 py-0.5 rounded-full transition-all"
            >
              <span>search (a-z)</span>
            </button>
          </div>
        </div>

        {/* 
          Kinetic Route Links Container
          Heavy, lowercase, SF Pro sans-serif typography, pure white contrast
          Ergonomically capped to max-height with no-scrollbar for compact viewports
        */}
        <div className="flex flex-col gap-0.5 sm:gap-1 overflow-y-auto no-scrollbar max-h-[44vh]">
          {visibleApps.length === 0 ? (
            <div className="py-6 text-center text-white/50 text-xs font-mono lowercase">
              <p>no apps in &apos;{settings.activeMode}&apos; mode</p>
              <button
                type="button"
                onClick={() => setFocusMode("all")}
                className="mt-2 text-white underline underline-offset-4"
              >
                switch to all
              </button>
            </div>
          ) : (
            visibleApps.map((route) => (
              <a
                key={route.id}
                href={route.scheme}
                onClick={(e) => handleRouteClick(e, route)}
                className={`group flex ${alignmentClass} py-1.5 sm:py-2 px-2.5 rounded-2xl transition-all duration-120 active:opacity-35 active:scale-[0.985] -webkit-touch-callout-none select-none`}
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", system-ui, sans-serif',
                }}
              >
                {/* Heavy, lowercase, pure white typography */}
                <div className="flex items-center gap-2">
                  <span
                    className={`${fontClass} font-black tracking-tight text-white lowercase group-hover:translate-x-1 transition-transform duration-200 leading-tight`}
                  >
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
                  <span className="font-mono text-[11px] text-white/35 lowercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    {route.scheme}
                  </span>
                )}
              </a>
            ))
          )}
        </div>

        {/* Minimalist bottom utility bar */}
        <div className="mt-3 pt-2.5 flex items-center justify-between text-xs text-white/40 border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAppDirectoryOpen(true)}
              className="flex items-center gap-1 text-emerald-300 hover:text-white active:scale-95 transition-all lowercase font-semibold bg-emerald-400/20 hover:bg-emerald-400/30 px-2.5 py-1 rounded-full text-[11px]"
            >
              <span>+ add app</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizing(true)}
              className="flex items-center gap-1.5 text-white/80 hover:text-white active:scale-95 transition-all lowercase font-semibold bg-white/[0.08] hover:bg-white/[0.14] px-2.5 py-1 rounded-full text-[11px]"
            >
              <span>⚙ customize</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInspector(!showInspector)}
              className="hover:text-white/80 active:opacity-40 transition-colors lowercase font-medium text-[11px] hidden sm:inline"
            >
              {showInspector ? "hide routes" : `routes (${visibleApps.length})`}
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-white/50 lowercase">
            <span>{settings.dailyOpensCount} opens today</span>
          </div>
        </div>

        {/* Expandable Scheme Diagnostics Table */}
        {showInspector && (
          <div className="mt-3 pt-2 border-t border-white/10 flex flex-col gap-1.5 text-xs font-mono text-white/70 animate-in fade-in duration-200">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-sans font-semibold mb-0.5">
              Kinetic Schemes ({settings.activeMode} mode)
            </div>
            {visibleApps.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{r.label}</span>
                  <span className="text-white/40 text-[10px]">({r.widget.type})</span>
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
