"use client";

import React, { useState } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { WIDGET_CATALOG } from "@/lib/defaultWidgets";
import { WidgetKind, WidgetLayoutMode } from "@/types/launcher";

export default function WidgetModal() {
  const {
    widgets,
    addWidget,
    updateWidget,
    removeWidget,
    reorderWidgets,
    isWidgetModalOpen,
    setIsWidgetModalOpen,
    settings,
    setWidgetLayout,
  } = useLauncher();

  const [activeTab, setActiveTab] = useState<"catalog" | "active" | "ios_guide">("catalog");
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isWidgetModalOpen) return null;

  const handleCopyShortcut = () => {
    const shortcutScript = `// iOS Scriptable Minimalist Dumbphone Widget
// Fetches live telemetry and launches: https://ios-minimalist-launcher.vercel.app
let widget = new ListWidget();
widget.backgroundColor = new Color("#050f2d");

let timeText = widget.addText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
timeText.textColor = Color.white();
timeText.font = Font.boldSystemFont(32);

let label = widget.addText("minimalist launcher");
label.textColor = new Color("#ffffff", 0.5);
label.font = Font.systemFont(12);

widget.url = "https://ios-minimalist-launcher.vercel.app";
Script.setWidget(widget);
Script.complete();`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortcutScript).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Widget Studio & Management"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsWidgetModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[88vh] rounded-t-[32px] sm:rounded-[36px] flex flex-col overflow-hidden text-white shadow-2xl cursor-default"
        style={{
          backgroundColor: settings.oledMode ? "rgba(10, 10, 10, 0.96)" : "rgba(5, 15, 45, 0.95)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight lowercase">
              widget studio
            </h2>
            <p className="text-xs text-white/50 lowercase">
              catalog • multi-stack • custom widgets
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsWidgetModalOpen(false)}
            className="px-4 py-1.5 rounded-full bg-white text-[#050f2d] hover:bg-white/90 active:scale-95 text-xs font-bold lowercase transition-all"
          >
            done
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold lowercase transition-all ${
              activeTab === "catalog"
                ? "bg-white text-[#050f2d]"
                : "text-white/60 hover:text-white bg-white/5"
            }`}
          >
            + add widget
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold lowercase transition-all ${
              activeTab === "active"
                ? "bg-white text-[#050f2d]"
                : "text-white/60 hover:text-white bg-white/5"
            }`}
          >
            active ({widgets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ios_guide")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold lowercase transition-all ${
              activeTab === "ios_guide"
                ? "bg-white text-[#050f2d]"
                : "text-white/60 hover:text-white bg-white/5"
            }`}
          >
            ios home widget
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {/* CATALOG TAB */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                  choose a widget to add
                </span>
                <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-lg text-[10px] font-mono">
                  <span className="text-white/40 px-1.5">layout:</span>
                  {(["carousel", "stack"] as WidgetLayoutMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWidgetLayout(m)}
                      className={`px-2 py-0.5 rounded-md lowercase transition-all ${
                        settings.widgetLayout === m
                          ? "bg-white text-[#050f2d] font-bold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WIDGET_CATALOG.map((cat) => {
                  const alreadyAdded = widgets.some((w) => w.kind === cat.kind);
                  return (
                    <div
                      key={cat.kind}
                      className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex flex-col justify-between transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white lowercase">
                            {cat.title}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                            {cat.category}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 leading-snug">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/40">
                          {alreadyAdded ? "active" : "ready"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            addWidget(cat.kind);
                            setActiveTab("active");
                          }}
                          className="px-3 py-1 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#050f2d] text-xs font-bold lowercase transition-all active:scale-95"
                        >
                          + add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVE WIDGETS TAB */}
          {activeTab === "active" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                  manage active widgets ({widgets.length})
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  reorder with arrows
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {widgets.map((w, idx) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono text-white/30 w-4">
                        {idx + 1}.
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-white lowercase truncate">
                          {w.title}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono lowercase truncate">
                          type: {w.kind}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderWidgets(idx, idx - 1)}
                        className="w-7 h-7 rounded-lg bg-white/10 disabled:opacity-20 hover:bg-white/20 text-xs font-mono flex items-center justify-center transition-all"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === widgets.length - 1}
                        onClick={() => reorderWidgets(idx, idx + 1)}
                        className="w-7 h-7 rounded-lg bg-white/10 disabled:opacity-20 hover:bg-white/20 text-xs font-mono flex items-center justify-center transition-all"
                        title="Move Down"
                      >
                        ↓
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => updateWidget(w.id, { enabled: !w.enabled })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono lowercase transition-all ${
                          w.enabled
                            ? "bg-white/20 text-white font-bold"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {w.enabled ? "on" : "off"}
                      </button>

                      {/* Delete (if more than 1) */}
                      {widgets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWidget(w.id)}
                          className="w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs flex items-center justify-center transition-all"
                          title="Remove Widget"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IOS HOME SCREEN WIDGET GUIDE */}
          {activeTab === "ios_guide" && (
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                native ios home screen widgets
              </span>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-white lowercase">
                  how dumb phone apps provide ios widgets:
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Apps like <strong>Dumb Phone (by Michael Tigas)</strong> and <strong>Blank Spaces</strong> install widgets on your iOS Home Screen. You can achieve this same clean setup in 2 ways:
                </p>

                <div className="flex flex-col gap-2 text-xs text-white/80">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] flex flex-col gap-1">
                    <span className="font-bold text-white">Method 1: Standalone PWA Launcher (Zero Setup)</span>
                    <span className="text-white/60">
                      In Safari, tap <strong>Share</strong> ➔ <strong>Add to Home Screen</strong>. Your phone gets a dedicated, full-screen minimalist dumb phone desktop with interactive widgets built right in!
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.04] flex flex-col gap-1.5">
                    <span className="font-bold text-white">Method 2: iOS Scriptable Widget (Native Home Screen)</span>
                    <span className="text-white/60">
                      Download free <strong>Scriptable</strong> from the App Store, create a new widget, and paste this ready-to-run code to render live minimal typography on your actual iOS Home Screen:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyShortcut}
                      className="self-start px-3 py-1.5 rounded-xl bg-emerald-400 text-[#050f2d] font-bold text-xs lowercase transition-all active:scale-95"
                    >
                      {copiedCode ? "✓ script copied to clipboard" : "📋 copy scriptable widget code"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
