"use client";

import React from "react";
import { WidgetInstance } from "@/types/launcher";

interface CountdownWidgetProps {
  widget: WidgetInstance;
}

export default function CountdownWidget({ widget }: CountdownWidgetProps) {
  const targetDateStr = widget.config.targetDate || "2026-12-31";
  const eventName = widget.config.targetEvent || "milestone";

  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diffDays = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>{widget.title || "countdown"}</span>
        </span>
        <span className="text-[10px] text-indigo-300 font-mono">{targetDateStr}</span>
      </div>

      <div className="p-3 rounded-2xl bg-white/[0.06] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-3xl sm:text-4xl font-black text-white lowercase">
            {diffDays} <span className="text-base font-normal text-white/50">days</span>
          </span>
          <span className="text-xs text-white/50 lowercase mt-0.5">
            until {eventName}
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-400/20 text-indigo-300 font-mono font-semibold lowercase">
          target
        </span>
      </div>
    </div>
  );
}
