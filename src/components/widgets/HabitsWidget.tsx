"use client";

import React, { useState } from "react";
import { WidgetInstance, HabitItem } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface HabitsWidgetProps {
  widget: WidgetInstance;
}

export default function HabitsWidget({ widget }: HabitsWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const habits: HabitItem[] = widget.config.habits || [];
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const toggleHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const habit = habits.find((h) => h.id === id);
    const nextState = !habit?.completedToday;
    const nextStreak = nextState ? (habit?.streak || 0) + 1 : Math.max(0, (habit?.streak || 0) - 1);

    const updated = habits.map((h) => {
      if (h.id === id) {
        return {
          ...h,
          completedToday: nextState,
          streak: nextStreak,
        };
      }
      return h;
    });

    updateWidget(widget.id, {
      config: { ...widget.config, habits: updated },
    });

    if (nextState) {
      showToast(`🔥 ${nextStreak}d streak: ${habit?.name}!`);
    } else {
      showToast(`habit unchecked: ${habit?.name}`);
    }
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit: HabitItem = {
      id: `h_${Date.now()}`,
      name: newHabitName.trim().toLowerCase(),
      streak: 1,
      completedToday: true,
    };
    updateWidget(widget.id, {
      config: { ...widget.config, habits: [...habits, newHabit] },
    });
    showToast(`added habit: "${newHabit.name}" 🔥`);
    setNewHabitName("");
    setIsAdding(false);
  };

  const deleteHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateWidget(widget.id, {
      config: { ...widget.config, habits: habits.filter((h) => h.id !== id) },
    });
    showToast("habit removed");
  };

  const openHealthApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast("opening apple health (x-apple-health:)");
    if (typeof window !== "undefined") {
      window.location.href = "x-apple-health://";
    }
  };

  const completedCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span>{widget.title || "mindful habits"}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openHealthApp}
            className="text-[10px] text-white/50 hover:text-white underline underline-offset-2 font-mono"
            title="Open Apple Health"
          >
            health ➔
          </button>
          <span className="text-[10px] text-violet-300 font-mono">
            {completedCount}/{habits.length} done
          </span>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] font-mono text-violet-300 hover:text-white px-2 py-0.5 rounded-full bg-violet-400/10 active:scale-95 transition-all"
          >
            {isAdding ? "cancel" : "+ add"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-2.5 rounded-2xl bg-white/[0.06] flex flex-col gap-2">
        {/* Inline Add Habit Input */}
        {isAdding && (
          <form onSubmit={handleAddHabit} className="flex items-center gap-1.5 pb-1 border-b border-white/10">
            <input
              type="text"
              autoFocus
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. 15m meditation, drink 2L water..."
              className="flex-1 bg-white/10 text-xs px-2.5 py-1 rounded-lg text-white placeholder:text-white/40 outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-violet-400 text-[#050f2d] text-[10px] font-bold lowercase shrink-0 active:scale-95"
            >
              add
            </button>
          </form>
        )}

        {/* Habit Horizontal Cards */}
        {habits.length === 0 ? (
          <div className="py-2 text-center text-xs text-white/40 font-mono">
            no habits defined • tap &quot;+ add&quot; to build streaks
          </div>
        ) : (
          <div className="flex items-stretch justify-start gap-2 overflow-x-auto no-scrollbar py-0.5">
            {habits.map((h) => (
              <div
                key={h.id}
                onClick={(e) => toggleHabit(h.id, e)}
                className={`flex-1 min-w-[100px] max-w-[140px] p-2.5 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer transition-all active:scale-[0.97] group relative ${
                  h.completedToday
                    ? "bg-violet-500/25 border border-violet-400/50 text-white shadow-sm"
                    : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
                title={`Tap to toggle "${h.name}"`}
              >
                <button
                  type="button"
                  onClick={(e) => deleteHabit(h.id, e)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[9px] text-white/30 hover:text-rose-400 font-mono"
                  title="Remove habit"
                >
                  ✕
                </button>

                <span className="text-[11px] font-bold lowercase truncate w-full mb-1">
                  {h.name}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black ${
                      h.completedToday ? "bg-violet-400 text-[#050f2d]" : "border border-white/30 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className={h.completedToday ? "text-violet-200 font-bold" : "text-white/40"}>
                    {h.streak}d streak
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
