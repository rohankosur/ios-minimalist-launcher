"use client";

import React from "react";
import { useLauncher } from "@/context/LauncherContext";
import WidgetRenderer from "./widgets/WidgetRenderer";

export default function TopWidgets() {
  const {
    widgets,
    activeWidgetIndex,
    setActiveWidgetIndex,
    cycleWidget,
    setIsWidgetModalOpen,
    settings,
  } = useLauncher();

  const enabledWidgets = widgets.filter((w) => w.enabled);
  const safeIndex = Math.max(0, Math.min(activeWidgetIndex, enabledWidgets.length - 1));
  const activeWidget = enabledWidgets[safeIndex] || enabledWidgets[0];

  // In stack mode, clock is top widget and active widget is bottom widget (if not clock)
  const isStackMode = settings.widgetLayout === "stack";
  const clockWidget = widgets.find((w) => w.kind === "clock") || enabledWidgets[0];
  const secondaryWidget = activeWidget?.kind !== "clock" ? activeWidget : enabledWidgets.find((w) => w.kind !== "clock");

  return (
    <header className="w-full px-5 pt-safe pb-2 flex flex-col justify-center select-none">
      {/* Widget Tabs & Carousel Controls */}
      <div className="flex items-center justify-between mb-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[78%] py-0.5 scroll-smooth">
          {enabledWidgets.map((w, idx) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWidgetIndex(idx)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-tight lowercase whitespace-nowrap transition-all ${
                safeIndex === idx
                  ? "bg-white text-[#050f2d] font-bold shadow-md"
                  : "bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>

        {/* Step controls and + Add Widget button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => cycleWidget("prev")}
            className="p-1 text-white/50 hover:text-white active:scale-90 transition-all text-xs"
            aria-label="Previous widget"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => cycleWidget("next")}
            className="p-1 text-white/50 hover:text-white active:scale-90 transition-all text-xs"
            aria-label="Next widget"
          >
            →
          </button>
          <button
            type="button"
            onClick={() => setIsWidgetModalOpen(true)}
            className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400/30 text-[10px] font-mono font-bold lowercase transition-all"
            title="Add or configure widgets"
          >
            + widget
          </button>
        </div>
      </div>

      {/* Widget Presentation Canvas */}
      <div className="min-h-[110px] sm:min-h-[125px] flex flex-col justify-center transition-all">
        {isStackMode && clockWidget && secondaryWidget ? (
          <div className="flex flex-col gap-2">
            <WidgetRenderer widget={clockWidget} />
            <div className="border-t border-white/5 pt-1.5">
              <WidgetRenderer widget={secondaryWidget} />
            </div>
          </div>
        ) : activeWidget ? (
          <WidgetRenderer widget={activeWidget} />
        ) : (
          <div className="p-4 rounded-2xl bg-white/[0.04] text-center text-white/40 text-xs font-mono">
            no active widgets • tap &quot;+ widget&quot; to add one
          </div>
        )}
      </div>
    </header>
  );
}
