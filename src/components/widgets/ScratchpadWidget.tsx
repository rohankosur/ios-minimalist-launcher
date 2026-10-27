"use client";

import React from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface ScratchpadWidgetProps {
  widget: WidgetInstance;
}

export default function ScratchpadWidget({ widget }: ScratchpadWidgetProps) {
  const { updateWidget } = useLauncher();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        memoText: e.target.value,
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{widget.title || "quick scratchpad"}</span>
        </span>
        <span className="text-[10px] text-white/40 font-mono">auto-saved</span>
      </div>

      <textarea
        value={widget.config.memoText || ""}
        onChange={handleChange}
        placeholder="tap to jot a quick thought, memo, or idea..."
        rows={2}
        className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] rounded-2xl p-2.5 text-white text-xs sm:text-sm font-semibold tracking-tight placeholder:text-white/30 resize-none outline-none border-none transition-all pointer-events-auto"
      />
    </div>
  );
}
