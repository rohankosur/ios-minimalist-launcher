"use client";

import React, { useState, useEffect } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { AppWidgetItem } from "@/types/launcher";

export default function AppWidgetCard() {
  const { apps, activeWidgetId, setActiveWidgetId, updateAppWidget } = useLauncher();
  const [clockTime, setClockTime] = useState("");
  const [clockDate, setClockDate] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Active app (if not master clock)
  const activeApp = apps.find((a) => a.id === activeWidgetId);

  // Time & Battery synchronization
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

    if ("getBattery" in navigator) {
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

  // Widget cycling logic
  const allWidgetIds = ["clock", ...apps.map((a) => a.id)];
  const currentIndex = allWidgetIds.indexOf(activeWidgetId);

  const cyclePrev = () => {
    const nextIdx = (currentIndex - 1 + allWidgetIds.length) % allWidgetIds.length;
    setActiveWidgetId(allWidgetIds[nextIdx]);
  };

  const cycleNext = () => {
    const nextIdx = (currentIndex + 1) % allWidgetIds.length;
    setActiveWidgetId(allWidgetIds[nextIdx]);
  };

  // Render widget content depending on active widget type
  const renderWidgetBody = () => {
    if (activeWidgetId === "clock" || !activeApp) {
      return (
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center gap-3 text-xs tracking-wider font-semibold text-white/50 lowercase mb-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>live</span>
            </span>
            <span>•</span>
            {batteryLevel !== null ? (
              <span>{batteryLevel}% {isCharging ? "bolt" : "charge"}</span>
            ) : (
              <span>orbital ready</span>
            )}
            <span>•</span>
            <span>cosmos</span>
          </div>
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-white leading-none">
            {clockTime || "00:00"}
          </h1>
          <p className="text-lg sm:text-xl font-bold tracking-tight text-white/80 lowercase mt-2">
            {clockDate || "loading..."}
          </p>
        </div>
      );
    }

    const { widget, scheme, label } = activeApp;

    switch (widget.type) {
      case "scratchpad":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                {widget.title}
              </span>
              <a
                href={scheme}
                className="text-white/60 hover:text-white underline underline-offset-2 pointer-events-auto"
              >
                launch {label}
              </a>
            </div>
            <textarea
              value={widget.value}
              onChange={(e) =>
                updateAppWidget(activeApp.id, {
                  ...widget,
                  value: e.target.value,
                })
              }
              placeholder="write a quick memo..."
              rows={2}
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] rounded-2xl p-3 text-white text-base font-semibold tracking-tight placeholder:text-white/30 resize-none outline-none border-none transition-all pointer-events-auto"
            />
            <p className="text-[11px] text-white/40 font-mono lowercase">
              auto-persisted to local device storage
            </p>
          </div>
        );

      case "contact":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {widget.title}
              </span>
              <span className="text-white/40">{label}</span>
            </div>
            <a
              href={widget.detail || scheme}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.985] transition-all pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                  {widget.value.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white lowercase">
                    {widget.value}
                  </span>
                  <span className="text-xs text-white/40 font-mono">
                    {widget.detail || "tap to dial direct"}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-mono font-semibold lowercase">
                dial
              </span>
            </a>
          </div>
        );

      case "sms_quick":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                {widget.title}
              </span>
              <span className="text-white/40">{label}</span>
            </div>
            <a
              href={widget.detail || scheme}
              className="flex flex-col p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.985] transition-all pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-white/50">draft message:</span>
                <span className="text-[11px] font-mono text-blue-300 uppercase tracking-wider">
                  dispatch
                </span>
              </div>
              <span className="text-lg font-bold text-white lowercase leading-snug">
                &quot;{widget.value}&quot;
              </span>
            </a>
          </div>
        );

      case "now_playing":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`} />
                {widget.title}
              </span>
              <a href={scheme} className="text-white/60 hover:text-white underline underline-offset-2 pointer-events-auto">
                open {label}
              </a>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] transition-all pointer-events-auto">
              <div className="flex flex-col max-w-[70%]">
                <span className="text-base sm:text-lg font-bold text-white lowercase truncate">
                  {widget.value}
                </span>
                <span className="text-xs text-white/40 lowercase truncate">
                  {widget.subtitle || "audio session active"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white text-sm font-bold transition-all"
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
            </div>
          </div>
        );

      case "directions":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
                {widget.title}
              </span>
              <span className="text-white/40">{label}</span>
            </div>
            <a
              href={widget.detail || scheme}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.985] transition-all pointer-events-auto"
            >
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-white lowercase">
                  {widget.value}
                </span>
                <span className="text-xs text-white/40 lowercase">
                  {widget.subtitle || "tap for transit route"}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-400/20 text-sky-300 font-mono font-semibold lowercase">
                route
              </span>
            </a>
          </div>
        );

      case "telemetry":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {widget.title}
              </span>
              <a href={scheme} className="text-white/60 hover:text-white underline underline-offset-2 pointer-events-auto">
                launch {label}
              </a>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.06] flex flex-col gap-1.5 pointer-events-auto">
              <span className="text-base font-bold text-white lowercase">
                {widget.value}
              </span>
              <span className="text-xs text-white/40 font-mono lowercase">
                {widget.detail || "status nominal"}
              </span>
            </div>
          </div>
        );

      case "agenda":
        return (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
              <span className="flex items-center gap-1.5 font-bold text-white/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400" />
                {widget.title}
              </span>
              <a href={scheme} className="text-white/60 hover:text-white underline underline-offset-2 pointer-events-auto">
                view calendar
              </a>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.06] flex flex-col gap-1 pointer-events-auto">
              <span className="text-base font-bold text-white lowercase">
                {widget.value}
              </span>
              <span className="text-xs text-white/40 font-mono lowercase">
                {widget.subtitle || "next scheduled event"}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full p-4 rounded-2xl bg-white/[0.06]">
            <span className="text-base font-bold text-white lowercase">
              {widget.title}: {widget.value}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="w-full px-6 pt-safe pb-4 flex flex-col justify-center select-none">
      {/* Widget Carousel Navigator Bar */}
      <div className="flex items-center justify-between mb-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[85%] py-1 scroll-smooth">
          <button
            type="button"
            onClick={() => setActiveWidgetId("clock")}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-tight lowercase transition-all ${
              activeWidgetId === "clock"
                ? "bg-white text-[#050f2d] font-bold shadow-md"
                : "bg-white/10 text-white/60 hover:text-white"
            }`}
          >
            clock
          </button>
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setActiveWidgetId(app.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-tight lowercase whitespace-nowrap transition-all ${
                activeWidgetId === app.id
                  ? "bg-white text-[#050f2d] font-bold shadow-md"
                  : "bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>

        {/* Step arrow controls */}
        <div className="flex items-center gap-1 text-white/40">
          <button
            type="button"
            onClick={cyclePrev}
            className="p-1 hover:text-white active:scale-90 transition-all text-xs"
            aria-label="Previous widget"
          >
            ←
          </button>
          <button
            type="button"
            onClick={cycleNext}
            className="p-1 hover:text-white active:scale-90 transition-all text-xs"
            aria-label="Next widget"
          >
            →
          </button>
        </div>
      </div>

      {/* Main Widget Canvas */}
      <div className="min-h-[140px] flex flex-col justify-center">
        {renderWidgetBody()}
      </div>
    </div>
  );
}
