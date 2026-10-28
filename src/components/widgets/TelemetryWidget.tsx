"use client";

import React, { useState, useEffect } from "react";
import { WidgetInstance, FocusMode } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface TelemetryWidgetProps {
  widget: WidgetInstance;
}

const MODES: FocusMode[] = ["all", "essential", "focus", "personal"];

export default function TelemetryWidget({ widget }: TelemetryWidgetProps) {
  const { settings, setFocusMode, toggleOledMode, showToast, setIsCustomizing } = useLauncher();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (typeof window !== "undefined" && "getBattery" in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          const updateBatt = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
          };
          updateBatt();
          battery.addEventListener("levelchange", updateBatt);
          battery.addEventListener("chargingchange", updateBatt);
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const openScheme = (scheme: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`opening ${label} (${scheme})`);
    if (typeof window !== "undefined") {
      window.location.href = scheme;
    }
  };

  const cycleFocusMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const curIdx = MODES.indexOf(settings.activeMode);
    const nextMode = MODES[(curIdx + 1) % MODES.length];
    setFocusMode(nextMode);
    showToast(`switched focus mode to "${nextMode}"`);
  };

  const handleToggleOled = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOledMode();
    showToast(!settings.oledMode ? "oled true pitch black enabled" : "starfield background enabled");
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{widget.title || "device telemetry"}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => openScheme("App-prefs://", "ios settings", e)}
            className="text-white/60 hover:text-white underline underline-offset-2 text-[10px] font-mono"
          >
            ios settings ➔
          </button>
          <button
            type="button"
            onClick={() => setIsCustomizing(true)}
            className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/80 active:scale-95"
          >
            customize
          </button>
        </div>
      </div>

      {/* 4-Tile Interactive Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-white/[0.06]">
        {/* Battery Tile */}
        <div
          onClick={(e) => openScheme("App-prefs:root=BATTERY_USAGE", "battery settings", e)}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 cursor-pointer transition-all flex flex-col justify-between"
          title="Tap to open iOS Battery settings"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>battery</span>
            <span className="text-emerald-400 font-bold">➔</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-bold text-white">
              {batteryLevel !== null ? `${batteryLevel}%` : "100%"}
            </span>
            <span className="text-[10px] text-white/50 font-mono">
              {isCharging ? "bolt" : "nominal"}
            </span>
          </div>
        </div>

        {/* Network & Wi-Fi Tile */}
        <div
          onClick={(e) => openScheme("App-prefs:root=WIFI", "wi-fi settings", e)}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 cursor-pointer transition-all flex flex-col justify-between"
          title="Tap to open iOS Wi-Fi settings"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>connectivity</span>
            <span className="text-sky-400 font-bold">➔</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-bold text-white">
              {isOnline ? "online" : "offline"}
            </span>
            <span className="text-[10px] text-sky-300 font-mono">
              pwa cached
            </span>
          </div>
        </div>

        {/* Focus Mode Cycler Tile */}
        <div
          onClick={cycleFocusMode}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 cursor-pointer transition-all flex flex-col justify-between"
          title="Tap to cycle Dumb Phone Focus Modes"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>focus mode</span>
            <span className="text-amber-400 font-bold">↻</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-bold text-amber-300 lowercase">
              {settings.activeMode}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              tap to cycle
            </span>
          </div>
        </div>

        {/* Display OLED Pitch Black Toggle Tile */}
        <div
          onClick={handleToggleOled}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 cursor-pointer transition-all flex flex-col justify-between"
          title="Tap to toggle OLED Pitch-Black mode"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>display</span>
            <span className="text-violet-400 font-bold">⇄</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-bold text-white lowercase">
              {settings.oledMode ? "oled black" : "starfield"}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              {settings.dailyOpensCount} opens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
