"use client";

import React, { useState, useEffect } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface CountdownWidgetProps {
  widget: WidgetInstance;
}

export default function CountdownWidget({ widget }: CountdownWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(widget.config.targetEvent || "milestone");
  const [targetDateStr, setTargetDateStr] = useState(
    widget.config.targetDate || "2026-12-31"
  );
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calcTime = () => {
      const target = new Date(targetDateStr).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, target - now);

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

      setTimeRemaining({ days, hours, minutes });
    };

    calcTime();
    const interval = setInterval(calcTime, 60000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        targetEvent: eventName,
        targetDate: targetDateStr,
      },
    });
    setIsEditing(false);
    showToast(`target set to "${eventName}"`);
  };

  const setPreset = (name: string, daysAhead: number) => {
    const target = new Date(Date.now() + daysAhead * 86400000).toISOString().split("T")[0];
    setEventName(name);
    setTargetDateStr(target);
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        targetEvent: name,
        targetDate: target,
      },
    });
    setIsEditing(false);
    showToast(`countdown set: ${name}`);
  };

  const openCalendar = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast("opening apple calendar (calshow:)");
    if (typeof window !== "undefined") {
      window.location.href = "calshow:";
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>{widget.title || "countdown"}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCalendar}
            className="text-[10px] text-white/50 hover:text-white underline underline-offset-2 font-mono"
            title="Open Apple Calendar"
          >
            calendar ➔
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[10px] font-mono text-indigo-300 hover:text-white px-2 py-0.5 rounded-full bg-indigo-400/10 active:scale-95 transition-all"
          >
            {isEditing ? "done" : "✎ edit"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-3 rounded-2xl bg-white/[0.06] flex flex-col gap-2">
        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/50 font-mono">event title</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/50 font-mono">target date</label>
              <input
                type="date"
                value={targetDateStr}
                onChange={(e) => setTargetDateStr(e.target.value)}
                className="bg-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white outline-none"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[9px] font-mono">
                <button
                  type="button"
                  onClick={() => setPreset("weekend", 5)}
                  className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 hover:text-white"
                >
                  weekend
                </button>
                <button
                  type="button"
                  onClick={() => setPreset("end of month", 20)}
                  className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 hover:text-white"
                >
                  month end
                </button>
              </div>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-indigo-400 text-[#050f2d] text-xs font-bold lowercase"
              >
                save target
              </button>
            </div>
          </form>
        ) : (
          <div
            onClick={openCalendar}
            className="flex items-center justify-between cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
            title="Tap to open Apple Calendar"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white lowercase">
                  {timeRemaining.days}
                  <span className="text-sm font-normal text-white/50 ml-1">days</span>
                </span>
                <span className="text-xs text-white/50 font-mono">
                  {timeRemaining.hours}h {timeRemaining.minutes}m
                </span>
              </div>
              <span className="text-xs text-indigo-200 lowercase mt-0.5 font-medium">
                until {eventName}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-400/20 text-indigo-300 font-mono font-semibold lowercase">
                {targetDateStr}
              </span>
              <span className="text-[10px] text-white/40 font-mono">view in cal ➔</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
