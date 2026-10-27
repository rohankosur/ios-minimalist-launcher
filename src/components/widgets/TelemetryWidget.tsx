"use client";

import React, { useState, useEffect } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface TelemetryWidgetProps {
  widget: WidgetInstance;
}

export default function TelemetryWidget({ widget }: TelemetryWidgetProps) {
  const { settings } = useLauncher();
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
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatt = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBatt();
        battery.addEventListener("levelchange", updateBatt);
        battery.addEventListener("chargingchange", updateBatt);
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>{widget.title || "device telemetry"}</span>
        </span>
        <a
          href="App-prefs://"
          className="text-white/60 hover:text-white underline underline-offset-2 text-[10px]"
        >
          ios settings
        </a>
      </div>

      <div className="p-3 rounded-2xl bg-white/[0.06] flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white lowercase">
              {batteryLevel !== null ? `${batteryLevel}% ${isCharging ? "charging" : "battery"}` : "standby ready"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
              {isOnline ? "online" : "offline pwa"}
            </span>
          </div>
          <span className="text-xs text-white/40 font-mono lowercase">
            {settings.dailyOpensCount} app dispatches today • {settings.activeMode} mode
          </span>
        </div>
      </div>
    </div>
  );
}
