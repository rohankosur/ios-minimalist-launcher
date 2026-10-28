"use client";

import React, { useState } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface WeatherWidgetProps {
  widget: WidgetInstance;
}

export default function WeatherWidget({ widget }: WeatherWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const [unit, setUnit] = useState<"F" | "C">(widget.config.unit || "F");
  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "metrics">("current");

  const toggleUnit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextUnit = unit === "F" ? "C" : "F";
    setUnit(nextUnit);
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        unit: nextUnit,
        temp: nextUnit === "F" ? "72°" : "22°",
      },
    });
    showToast(`units set to °${nextUnit}`);
  };

  const openWeatherApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    showToast("launching apple weather (weather:)");
    if (typeof window !== "undefined") {
      window.location.href = "weather:";
    }
  };

  const tempDisplay = unit === "F" ? (widget.config.temp || "72°") : (widget.config.temp || "22°");

  const hourlyForecast = [
    { time: "now", temp: unit === "F" ? "72°" : "22°", icon: "☀️" },
    { time: "12pm", temp: unit === "F" ? "75°" : "24°", icon: "🌤️" },
    { time: "3pm", temp: unit === "F" ? "76°" : "24°", icon: "⛅" },
    { time: "6pm", temp: unit === "F" ? "70°" : "21°", icon: "🌅" },
    { time: "9pm", temp: unit === "F" ? "64°" : "18°", icon: "🌙" },
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Widget Header */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>{widget.title || "atmosphere"}</span>
        </span>
        <div className="flex items-center gap-2">
          {/* Sub-view switcher */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5 text-[9px] font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("current")}
              className={`px-1.5 py-0.5 rounded-full transition-all ${
                activeTab === "current" ? "bg-white text-[#050f2d] font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              now
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hourly")}
              className={`px-1.5 py-0.5 rounded-full transition-all ${
                activeTab === "hourly" ? "bg-white text-[#050f2d] font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              hourly
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("metrics")}
              className={`px-1.5 py-0.5 rounded-full transition-all ${
                activeTab === "metrics" ? "bg-white text-[#050f2d] font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              metrics
            </button>
          </div>

          <button
            type="button"
            onClick={toggleUnit}
            className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] font-mono text-white/80"
          >
            °{unit}
          </button>
        </div>
      </div>

      {/* Main Interactive Weather Card */}
      <div
        onClick={openWeatherApp}
        className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] active:scale-[0.985] cursor-pointer transition-all flex flex-col justify-between"
      >
        {activeTab === "current" && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white lowercase">
                  {tempDisplay}
                </span>
                <span className="text-xs text-sky-300 font-mono lowercase">
                  {widget.config.condition || "clear sky"}
                </span>
              </div>
              <span className="text-xs text-white/50 lowercase mt-0.5">
                {widget.config.location || "local telemetry"} • h: {unit === "F" ? "76°" : "24°"} l: {unit === "F" ? "58°" : "14°"}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-400/20 text-sky-300 font-mono font-semibold lowercase">
                open radar ➔
              </span>
              <span className="text-[10px] text-white/40 font-mono">tap for ios weather</span>
            </div>
          </div>
        )}

        {activeTab === "hourly" && (
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
            {hourlyForecast.map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/[0.04] text-center"
              >
                <span className="text-[10px] text-white/50 font-mono">{h.time}</span>
                <span className="text-xs my-0.5">{h.icon}</span>
                <span className="text-xs font-bold text-white font-mono">{h.temp}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="grid grid-cols-4 gap-2 text-center py-1">
            <div className="flex flex-col bg-white/[0.04] p-1 rounded-xl">
              <span className="text-[9px] text-white/40 font-mono">humidity</span>
              <span className="text-xs font-bold text-sky-300">46%</span>
            </div>
            <div className="flex flex-col bg-white/[0.04] p-1 rounded-xl">
              <span className="text-[9px] text-white/40 font-mono">wind</span>
              <span className="text-xs font-bold text-white">8 mph</span>
            </div>
            <div className="flex flex-col bg-white/[0.04] p-1 rounded-xl">
              <span className="text-[9px] text-white/40 font-mono">uv index</span>
              <span className="text-xs font-bold text-amber-300">2 low</span>
            </div>
            <div className="flex flex-col bg-white/[0.04] p-1 rounded-xl">
              <span className="text-[9px] text-white/40 font-mono">aqi</span>
              <span className="text-xs font-bold text-emerald-300">22 good</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
