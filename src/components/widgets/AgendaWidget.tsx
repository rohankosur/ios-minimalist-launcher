"use client";

import React, { useState } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface AgendaWidgetProps {
  widget: WidgetInstance;
}

interface AgendaItem {
  id: string;
  time: string;
  title: string;
}

export default function AgendaWidget({ widget }: AgendaWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const [items, setItems] = useState<AgendaItem[]>(
    widget.config.agendaItems || [
      { id: "a1", time: "10:00", title: "morning sync & design alignment" },
      { id: "a2", time: "14:00", title: "deep focus coding sprint" },
      { id: "a3", time: "17:30", title: "daily retrospective & review" },
    ]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [timeInput, setTimeInput] = useState("12:00");
  const [titleInput, setTitleInput] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    const newItem: AgendaItem = {
      id: `agenda_${Date.now()}`,
      time: timeInput,
      title: titleInput.trim().toLowerCase(),
    };
    const updated = [...items, newItem];
    setItems(updated);
    updateWidget(widget.id, {
      config: { ...widget.config, agendaItems: updated },
    });
    showToast(`scheduled event: "${newItem.title}"`);
    setTitleInput("");
    setIsAdding(false);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    updateWidget(widget.id, {
      config: { ...widget.config, agendaItems: updated },
    });
    showToast("event removed");
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
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>{widget.title || "calendar agenda"}</span>
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
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] font-mono text-blue-300 hover:text-white px-2 py-0.5 rounded-full bg-blue-400/10 active:scale-95 transition-all"
          >
            {isAdding ? "cancel" : "+ event"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-2.5 rounded-2xl bg-white/[0.06] flex flex-col gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
        {isAdding && (
          <form onSubmit={handleAdd} className="flex items-center gap-1.5 pb-1 border-b border-white/10">
            <input
              type="text"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-14 bg-white/10 text-xs px-2 py-1 rounded text-white text-center font-mono outline-none"
              placeholder="12:00"
            />
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="event name..."
              className="flex-1 bg-white/10 text-xs px-2 py-1 rounded text-white outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-blue-400 text-[#050f2d] text-[10px] font-bold lowercase shrink-0 active:scale-95"
            >
              add
            </button>
          </form>
        )}

        {items.length === 0 ? (
          <div className="py-2 text-center text-xs text-white/40 font-mono">
            no events scheduled today • tap calendar ➔
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={openCalendar}
              className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-white/[0.04] active:scale-[0.99] cursor-pointer group transition-all"
              title="Tap to open in Apple Calendar"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono font-bold text-blue-300 shrink-0">
                  {item.time}
                </span>
                <span className="text-xs text-white/90 truncate lowercase">
                  {item.title}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => deleteItem(item.id, e)}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-rose-400 text-[10px] px-1 font-mono transition-opacity"
                title="Remove event"
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
