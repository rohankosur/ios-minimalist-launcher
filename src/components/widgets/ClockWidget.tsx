"use client";

import React, { useState, useEffect } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { WidgetInstance } from "@/types/launcher";

interface ClockWidgetProps {
  widget: WidgetInstance;
}

export default function ClockWidget({ widget }: ClockWidgetProps) {
  const { mounted, settings, showToast, updateWidget } = useLauncher();
  const [clockTime, setClockTime] = useState("");
  const [clockSeconds, setClockSeconds] = useState("");
  const [clockPeriod, setClockPeriod] = useState<string | null>(null);
  const [clockDate, setClockDate] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  const is12Hour = widget.config.timeFormat === "12h";
  const showSeconds = Boolean(widget.config.showSeconds);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let period: string | null = null;

      if (is12Hour) {
        period = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
      }

      const h = hours.toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds().toString().padStart(2, "0");

      setClockTime(`${h}:${m}`);
      setClockSeconds(`:${s}`);
      setClockPeriod(period);

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

    return () => clearInterval(interval);
  }, [is12Hour]);

  const toggleTimeFormat = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextFormat = is12Hour ? "24h" : "12h";
    updateWidget(widget.id, {
      config: { ...widget.config, timeFormat: nextFormat },
    });
    showToast(`switched to ${nextFormat} format`);
  };

  const toggleSeconds = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSeconds = !showSeconds;
    updateWidget(widget.id, {
      config: { ...widget.config, showSeconds: nextSeconds },
    });
    showToast(nextSeconds ? "seconds enabled" : "seconds hidden");
  };

  const handleClockLaunch = (scheme: string, label: string) => {
    showToast(`opening ${label} (${scheme})`);
    if (typeof window !== "undefined") {
      window.location.href = scheme;
    }
  };

  return (
    <div className="flex flex-col items-start justify-center select-none pointer-events-auto">
      {/* Top telemetry status strip */}
      <div className="flex items-center gap-2 text-[11px] tracking-wider font-semibold text-white/50 lowercase mb-1">
        <button
          type="button"
          onClick={toggleSeconds}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
          title="Click to toggle seconds"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>live</span>
        </button>
        <span>•</span>
        {batteryLevel !== null ? (
          <button
            type="button"
            onClick={() => handleClockLaunch("App-prefs:root=BATTERY_USAGE", "battery settings")}
            className="hover:text-emerald-300 transition-colors"
            title="Open Battery Settings"
          >
            {batteryLevel}% {isCharging ? "bolt" : "charge"}
          </button>
        ) : (
          <span>orbital ready</span>
        )}
        <span>•</span>
        <span>{settings.dailyOpensCount} opens</span>
      </div>

      {/* Main clickable digital clock display */}
      <div className="flex items-baseline gap-2 group">
        <a
          href="clock-alarm:"
          onClick={(e) => {
            e.preventDefault();
            handleClockLaunch("clock-alarm:", "ios clock & alarms");
          }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none hover:text-emerald-300 active:scale-[0.98] transition-all cursor-pointer flex items-baseline gap-1"
          title="Tap to open iOS Clock & Alarm"
        >
          <span>{mounted && clockTime ? clockTime : "12:00"}</span>
          {showSeconds && (
            <span className="text-2xl sm:text-3xl font-light text-white/40 font-mono">
              {clockSeconds}
            </span>
          )}
        </a>

        {clockPeriod && (
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400/90 px-1.5 py-0.5 rounded bg-emerald-400/10">
            {clockPeriod}
          </span>
        )}
      </div>

      {/* Clickable Date (Opens Calendar) */}
      <a
        href="calshow:"
        onClick={(e) => {
          e.preventDefault();
          handleClockLaunch("calshow:", "apple calendar");
        }}
        className="text-sm sm:text-base font-bold tracking-tight text-white/80 hover:text-white lowercase mt-1.5 transition-colors cursor-pointer flex items-center gap-1.5"
        title="Tap to open Apple Calendar"
      >
        <span>{mounted && clockDate ? clockDate : "launching session..."}</span>
        <span className="text-[10px] text-white/40 font-mono">→</span>
      </a>

      {/* Kinetic Quick-Action Toolstrip */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <a
          href="clock-alarm:"
          onClick={(e) => {
            e.preventDefault();
            handleClockLaunch("clock-alarm:", "clock");
          }}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] font-mono text-white/80 transition-all"
        >
          ⏰ alarm
        </a>
        <a
          href="calshow:"
          onClick={(e) => {
            e.preventDefault();
            handleClockLaunch("calshow:", "calendar");
          }}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] font-mono text-white/80 transition-all"
        >
          📅 calendar
        </a>
        <button
          type="button"
          onClick={toggleTimeFormat}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] font-mono text-white/80 transition-all"
        >
          {is12Hour ? "24h mode" : "12h mode"}
        </button>
        <button
          type="button"
          onClick={toggleSeconds}
          className={`px-2 py-0.5 rounded-full active:scale-95 text-[10px] font-mono transition-all ${
            showSeconds ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white/60 hover:text-white"
          }`}
        >
          :ss
        </button>
      </div>
    </div>
  );
}
