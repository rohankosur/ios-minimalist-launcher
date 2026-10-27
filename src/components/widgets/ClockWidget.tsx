"use client";

import React, { useState, useEffect } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { WidgetInstance } from "@/types/launcher";

interface ClockWidgetProps {
  widget: WidgetInstance;
}

export default function ClockWidget({ widget }: ClockWidgetProps) {
  const { mounted, settings } = useLauncher();
  const [clockTime, setClockTime] = useState("");
  const [clockDate, setClockDate] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setClockTime(`${h}:${m}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      setClockDate(now.toLocaleDateString("en-US", options).toLowerCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

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

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start justify-center select-none">
      <div className="flex items-center gap-2 text-[11px] tracking-wider font-semibold text-white/50 lowercase mb-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>live</span>
        </span>
        <span>•</span>
        {batteryLevel !== null ? (
          <span>
            {batteryLevel}% {isCharging ? "bolt" : "charge"}
          </span>
        ) : (
          <span>orbital ready</span>
        )}
        <span>•</span>
        <span>{settings.dailyOpensCount} opens</span>
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
        {mounted && clockTime ? clockTime : "12:00"}
      </h1>

      <p className="text-sm sm:text-base font-bold tracking-tight text-white/80 lowercase mt-1.5">
        {mounted && clockDate ? clockDate : "launching session..."}
      </p>
    </div>
  );
}
