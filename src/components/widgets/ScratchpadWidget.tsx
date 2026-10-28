"use client";

import React from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface ScratchpadWidgetProps {
  widget: WidgetInstance;
}

export default function ScratchpadWidget({ widget }: ScratchpadWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const memoText = widget.config.memoText || "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        memoText: e.target.value,
      },
    });
  };

  const copyNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!memoText) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(memoText).then(() => {
        showToast("scratchpad copied to clipboard 📋");
      }).catch(() => {
        showToast("memo copied");
      });
    } else {
      showToast("memo copied");
    }
  };

  const openAppleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast("launching apple notes (mobilenotes:)");
    if (typeof window !== "undefined") {
      window.location.href = "mobilenotes://";
    }
  };

  const appendTemplate = (template: string) => {
    const updated = memoText ? `${memoText}\n${template}` : template;
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        memoText: updated,
      },
    });
    showToast(`inserted template: ${template}`);
  };

  const clearMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        memoText: "",
      },
    });
    showToast("scratchpad cleared");
  };

  const words = memoText.trim() ? memoText.trim().split(/\s+/).length : 0;
  const chars = memoText.length;

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{widget.title || "quick scratchpad"}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAppleNotes}
            className="text-[10px] text-white/60 hover:text-white underline underline-offset-2 font-mono"
            title="Open in Apple Notes"
          >
            apple notes ➔
          </button>
          <span className="text-[10px] text-white/40 font-mono">
            {words}w • {chars}c
          </span>
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl bg-white/[0.06]">
        <textarea
          value={memoText}
          onChange={handleChange}
          placeholder="tap to jot a quick thought, memo, or idea..."
          rows={2}
          className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold tracking-tight placeholder:text-white/30 resize-none outline-none border-none transition-all pointer-events-auto"
        />

        {/* Quick Actions & Template Toolbar */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px] font-mono">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => appendTemplate("• ")}
              className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 hover:text-white"
            >
              + bullet
            </button>
            <button
              type="button"
              onClick={() => appendTemplate("💡 idea: ")}
              className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 hover:text-white"
            >
              + idea
            </button>
            <button
              type="button"
              onClick={() => appendTemplate("[ ] todo: ")}
              className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 hover:text-white"
            >
              + task
            </button>
          </div>

          <div className="flex items-center gap-2">
            {memoText && (
              <>
                <button
                  type="button"
                  onClick={copyNote}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  copy
                </button>
                <button
                  type="button"
                  onClick={clearMemo}
                  className="text-white/40 hover:text-rose-400 transition-colors"
                >
                  clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
