"use client";

import React, { useState } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface WeatherWidgetProps {
  widget: WidgetInstance;
}

export default function WeatherWidget({ widget }: WeatherWidgetProps) {
  const { updateWidget } = useLauncher();
  const [unit, setUnit] = useState<"F" | "C">(widget.config.unit || "F");

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
  };

  const tempDisplay = unit === "F" ? (widget.config.temp || "72°") : (widget.config.temp || "22°");

  return (
    <div className="w-full flex flex-col gap-1.5 select-none">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>{widget.title || "atmosphere"}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleUnit}
            className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/70"
          >
            °{unit}
          </button>
          <a
            href="weather:"
            className="text-white/60 hover:text-white underline underline-offset-2 pointer-events-auto"
          >
            open radar
          </a>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-white/[0.06] flex items-center justify-between pointer-events-auto">
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
        <span className="text-xs px-2.5 py-1 rounded-full bg-sky-400/20 text-sky-300 font-mono font-semibold lowercase">
          fair
        </span>
      </div>
    </div>
  );
}
