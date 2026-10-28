"use client";

import React, { useState } from "react";
import { WidgetInstance, TaskItem } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface TasksWidgetProps {
  widget: WidgetInstance;
}

export default function TasksWidget({ widget }: TasksWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const tasks: TaskItem[] = widget.config.tasks || [];
  const [newText, setNewText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetTask = tasks.find((t) => t.id === id);
    const willBeCompleted = targetTask ? !targetTask.completed : false;

    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: updated },
    });

    if (willBeCompleted) {
      showToast(`task completed: "${targetTask?.text}" ✓`);
    }
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
    showToast(`added task: "${newTask.text}"`);
    setNewText("");
    setIsAdding(false);
  };

  const addQuickPreset = (text: string) => {
    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      text: text.toLowerCase(),
      completed: false,
    };
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: [...tasks, newTask] },
    });
    showToast(`added task: "${text}"`);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: tasks.filter((t) => t.id !== id) },
    });
    showToast("task deleted");
  };

  const clearCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = tasks.filter((t) => !t.completed);
    updateWidget(widget.id, {
      config: { ...widget.config, tasks: remaining },
    });
    showToast("cleared completed tasks");
  };

  const openAppleReminders = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast("launching apple reminders (x-apple-reminderkit:)");
    if (typeof window !== "undefined") {
      window.location.href = "x-apple-reminderkit://";
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{widget.title || "daily tasks"}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAppleReminders}
            className="text-[10px] text-white/60 hover:text-white underline underline-offset-2 font-mono"
            title="Open iOS Reminders app"
          >
            reminders ➔
          </button>
          <span className="text-[11px] text-white/40">
            {completedCount}/{tasks.length}
          </span>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-400/10 active:scale-95 transition-all"
          >
            {isAdding ? "cancel" : "+ add"}
          </button>
        </div>
      </div>

      {/* Task Card Container */}
      <div className="p-2.5 rounded-2xl bg-white/[0.06] flex flex-col gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
        {/* Quick Add Form */}
        {isAdding && (
          <form onSubmit={handleAddTask} className="flex flex-col gap-1.5 pb-1 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                autoFocus
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="type task & press return..."
                className="flex-1 bg-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-400 text-[#050f2d] text-[10px] font-bold lowercase shrink-0 active:scale-95 transition-all"
              >
                save
              </button>
            </div>
            {/* Instant suggested presets */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[9px] text-white/40 font-mono">quick:</span>
              {["deep work block", "drink water", "20m walk", "evening review"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addQuickPreset(preset)}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[9px] text-white/60 font-mono whitespace-nowrap"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </form>
        )}

        {/* Filter Toolbar (if 2+ tasks) */}
        {tasks.length > 2 && (
          <div className="flex items-center justify-between pb-1 border-b border-white/5 text-[9px] font-mono">
            <div className="flex items-center gap-1">
              {(["all", "active", "done"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilter(mode)}
                  className={`px-1.5 py-0.5 rounded ${
                    filter === mode ? "bg-white/20 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={clearCompleted}
                className="text-white/40 hover:text-rose-300"
              >
                clear done
              </button>
            )}
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="py-2 text-center flex flex-col items-center justify-center gap-1">
            <p className="text-xs text-white/40 font-mono">
              {tasks.length === 0 ? "no tasks pending • focus clear" : "no tasks in this view"}
            </p>
            {tasks.length === 0 && (
              <button
                type="button"
                onClick={() => addQuickPreset("focus deep work")}
                className="text-[10px] text-emerald-300 underline font-mono"
              >
                + add &quot;focus deep work&quot;
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={(e) => toggleTask(task.id, e)}
              className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-white/[0.04] active:scale-[0.99] cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] transition-all shrink-0 ${
                    task.completed
                      ? "bg-emerald-400 border-emerald-400 text-[#050f2d] font-black shadow-sm"
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
                title="Delete task"
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
