"use client";

import React, { useState } from "react";
import { WidgetInstance, TaskItem } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface TasksWidgetProps {
  widget: WidgetInstance;
}

export default function TasksWidget({ widget }: TasksWidgetProps) {
  const { updateWidget } = useLauncher();
  const tasks: TaskItem[] = widget.config.tasks || [];
  const [newText, setNewText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: updated },
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      text: newText.trim().toLowerCase(),
      completed: false,
    };
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: [...tasks, newTask] },
    });
    setNewText("");
    setIsAdding(false);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: tasks.filter((t) => t.id !== id) },
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{widget.title || "daily tasks"}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40">
            {completedCount}/{tasks.length} done
          </span>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-400/10"
          >
            {isAdding ? "cancel" : "+ add"}
          </button>
        </div>
      </div>

      <div className="p-2.5 rounded-2xl bg-white/[0.06] flex flex-col gap-1.5 max-h-[125px] overflow-y-auto no-scrollbar">
        {isAdding && (
          <form onSubmit={handleAddTask} className="flex items-center gap-1.5 pb-1 border-b border-white/10">
            <input
              type="text"
              autoFocus
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="new task..."
              className="flex-1 bg-white/10 text-xs px-2 py-1 rounded-lg text-white placeholder:text-white/40 outline-none"
            />
            <button
              type="submit"
              className="px-2 py-1 rounded-lg bg-emerald-400 text-[#050f2d] text-[10px] font-bold lowercase"
            >
              save
            </button>
          </form>
        )}

        {tasks.length === 0 ? (
          <p className="text-xs text-white/40 font-mono py-1">no tasks pending • focus clear</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={(e) => toggleTask(task.id, e)}
              className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] transition-all ${
                    task.completed
                      ? "bg-emerald-400 border-emerald-400 text-[#050f2d] font-black"
                      : "border-white/30 group-hover:border-white/60"
                  }`}
                >
                  {task.completed ? "✓" : ""}
                </span>
                <span
                  className={`text-xs font-medium lowercase truncate transition-all ${
                    task.completed ? "line-through text-white/35" : "text-white/90"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => deleteTask(task.id, e)}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-rose-400 text-[10px] px-1 font-mono transition-opacity"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
