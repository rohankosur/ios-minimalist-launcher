"use client";

import React from "react";
import { WidgetInstance, HabitItem } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface HabitsWidgetProps {
  widget: WidgetInstance;
}

export default function HabitsWidget({ widget }: HabitsWidgetProps) {
  const { updateWidget } = useLauncher();
  const habits: HabitItem[] = widget.config.habits || [];

  const toggleHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = habits.map((h) => {
      if (h.id === id) {
        const nextState = !h.completedToday;
        return {
          ...h,
          completedToday: nextState,
          streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });

    updateWidget(widget.id, {
      config: { ...widget.config, habits: updated },
    });
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span>{widget.title || "mindful habits"}</span>
        </span>
        <span className="text-[10px] text-violet-300 font-mono">daily streaks</span>
      </div>

      <div className="p-2.5 rounded-2xl bg-white/[0.06] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {habits.map((h) => (
          <div
            key={h.id}
            onClick={(e) => toggleHabit(h.id, e)}
            className={`flex-1 min-w-[90px] p-2 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 ${
              h.completedToday
                ? "bg-violet-500/20 border border-violet-400/40 text-white"
                : "bg-white/[0.04] text-white/60 hover:text-white"
            }`}
          >
            <span className="text-[11px] font-bold lowercase truncate w-full">
              {h.name}
            </span>
            <span className="text-[10px] font-mono mt-0.5 text-violet-300">
              {h.completedToday ? "✓" : "○"} {h.streak}d
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
