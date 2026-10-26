"use client";

import React, { useState } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { PRESET_LIBRARY } from "@/lib/defaultConfig";
import { WidgetType, PresetScheme, FocusMode, TextAlignment } from "@/types/launcher";

const WIDGET_TYPES: { type: WidgetType; label: string; desc: string }[] = [
  { type: "clock", label: "system clock", desc: "Digital typography & battery telemetry" },
  { type: "scratchpad", label: "quick scratchpad", desc: "Live editable memo with auto-persistence" },
  { type: "contact", label: "speed contact", desc: "One-tap direct dial for favorite contact" },
  { type: "sms_quick", label: "quick message", desc: "One-tap pre-filled SMS dispatch" },
  { type: "now_playing", label: "now playing", desc: "Interactive media playback session" },
  { type: "directions", label: "transit beacon", desc: "Instant turn-by-turn navigation shortcut" },
  { type: "telemetry", label: "device telemetry", desc: "Hardware & kernel state indicators" },
  { type: "agenda", label: "calendar agenda", desc: "Upcoming event countdown & itinerary" },
];

const MODES: FocusMode[] = ["essential", "focus", "personal", "all"];

export default function CustomizeModal() {
  const {
    apps,
    updateApp,
    updateAppWidget,
    addApp,
    deleteApp,
    reorderApp,
    resetDefaults,
    isCustomizing,
    setIsCustomizing,
    setActiveWidgetId,
    settings,
    setTextAlignment,
    updateSettings,
  } = useLauncher();

  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id || "");
  const [showAddDrawer, setShowAddDrawer] = useState<boolean>(false);
  const [customLabel, setCustomLabel] = useState<string>("");
  const [customScheme, setCustomScheme] = useState<string>("");
  const [customWidgetType, setCustomWidgetType] = useState<WidgetType>("telemetry");

  if (!isCustomizing) return null;

  const selectedApp = apps.find((a) => a.id === selectedAppId) || apps[0];

  const handleAddPreset = (preset: PresetScheme) => {
    addApp({
      label: preset.label.toLowerCase(),
      scheme: preset.scheme,
      description: preset.description,
      category: preset.category,
      enabled: true,
      mindfulDelay: false,
      modes: ["all", "personal"],
      widget: preset.defaultWidget,
    });
    setShowAddDrawer(false);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim() || !customScheme.trim()) return;

    addApp({
      label: customLabel.trim().toLowerCase(),
      scheme: customScheme.trim(),
      description: "Custom Application",
      category: "custom",
      enabled: true,
      mindfulDelay: false,
      modes: ["all"],
      widget: {
        type: customWidgetType,
        title: `${customLabel.trim().toLowerCase()} widget`,
        subtitle: `quick action for ${customLabel.trim().toLowerCase()}`,
        value: `active widget for ${customLabel.trim().toLowerCase()}`,
        detail: customScheme.trim(),
      },
    });

    setCustomLabel("");
    setCustomScheme("");
    setShowAddDrawer(false);
  };

  const selectedIndex = apps.findIndex((a) => a.id === selectedApp?.id);

  const toggleModeForApp = (mode: FocusMode) => {
    if (!selectedApp) return;
    const current = selectedApp.modes || ["all"];
    const updated = current.includes(mode)
      ? current.filter((m) => m !== mode)
      : [...current, mode];
    updateApp(selectedApp.id, { modes: updated });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-[36px] sm:rounded-[36px] flex flex-col overflow-hidden text-white shadow-2xl"
        style={{
          backgroundColor: "rgba(5, 15, 45, 0.92)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "none",
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight lowercase">
              customize dumb phone
            </h2>
            <p className="text-xs text-white/50 lowercase">
              behavioral friction • focus modes • widgets
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCustomizing(false)}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold lowercase transition-all"
          >
            done
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {/* Global Dumb Phone Settings Card */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
              ergonomics &amp; behavioral friction
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Text Alignment (from Olauncher) */}
              <div>
                <label className="text-[11px] text-white/50 block mb-1 lowercase">
                  text alignment
                </label>
                <div className="flex gap-1">
                  {(["left", "center", "right"] as TextAlignment[]).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => setTextAlignment(align)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono lowercase transition-all ${
                        settings.textAlignment === align
                          ? "bg-white text-[#050f2d] font-bold"
                          : "bg-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Mindful Pause (from Minimalist Phone / Blank Spaces) */}
              <div>
                <label className="text-[11px] text-white/50 block mb-1 lowercase">
                  mindful breathing pause
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      globalMindfulDelay: !settings.globalMindfulDelay,
                    })
                  }
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono lowercase transition-all ${
                    settings.globalMindfulDelay
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {settings.globalMindfulDelay ? "enabled (all apps)" : "per-app only"}
                </button>
              </div>
            </div>
          </div>

          {/* App Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                select app to configure
              </span>
              <button
                type="button"
                onClick={() => setShowAddDrawer(true)}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 lowercase"
              >
                + add new app
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {apps.map((app, idx) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedAppId(app.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold lowercase whitespace-nowrap transition-all ${
                    selectedApp?.id === app.id
                      ? "bg-white text-[#050f2d] shadow-lg scale-105"
                      : "bg-white/[0.08] text-white/70 hover:bg-white/15"
                  }`}
                >
                  {idx + 1}. {app.label}
                  {app.mindfulDelay ? " ⏸" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Add App Drawer View */}
          {showAddDrawer ? (
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-tight lowercase">
                  quick preset library
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddDrawer(false)}
                  className="text-xs text-white/40 hover:text-white lowercase"
                >
                  cancel
                </button>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LIBRARY.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="flex flex-col items-start p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-left transition-all"
                  >
                    <span className="text-sm font-bold text-white lowercase">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {preset.scheme}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom App Form */}
              <form onSubmit={handleAddCustom} className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-3">
                <span className="text-xs font-bold text-white/70 lowercase">
                  or add custom ios scheme:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="app name (e.g. reddit)"
                    className="flex-1 bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/30 outline-none lowercase"
                  />
                  <input
                    type="text"
                    value={customScheme}
                    onChange={(e) => setCustomScheme(e.target.value)}
                    placeholder="scheme:// (e.g. reddit://)"
                    className="flex-1 bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/30 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050f2d] font-bold text-xs lowercase transition-all"
                >
                  add custom app
                </button>
              </form>
            </div>
          ) : selectedApp ? (
            /* Selected App Customization Panel */
            <div className="flex flex-col gap-4">
              {/* App Basic Settings */}
              <div className="p-4 rounded-2xl bg-white/[0.04] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                    app parameters &amp; friction
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={selectedIndex === 0}
                      onClick={() => reorderApp(selectedIndex, selectedIndex - 1)}
                      className="px-2 py-0.5 rounded bg-white/10 disabled:opacity-20 text-xs hover:bg-white/20"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={selectedIndex === apps.length - 1}
                      onClick={() => reorderApp(selectedIndex, selectedIndex + 1)}
                      className="px-2 py-0.5 rounded bg-white/10 disabled:opacity-20 text-xs hover:bg-white/20"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove ${selectedApp.label} from launcher?`)) {
                          deleteApp(selectedApp.id);
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs hover:bg-rose-500/30 ml-2"
                      title="Delete app"
                    >
                      delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1 lowercase">
                      display label (lowercase)
                    </label>
                    <input
                      type="text"
                      value={selectedApp.label}
                      onChange={(e) =>
                        updateApp(selectedApp.id, {
                          label: e.target.value.toLowerCase(),
                        })
                      }
                      className="w-full bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white font-bold outline-none lowercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1 lowercase">
                      ios url scheme
                    </label>
                    <input
                      type="text"
                      value={selectedApp.scheme}
                      onChange={(e) =>
                        updateApp(selectedApp.id, {
                          scheme: e.target.value,
                        })
                      }
                      className="w-full bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Behavioral Friction Toggle for this app */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold lowercase text-white">
                      mindful pause on open
                    </span>
                    <span className="text-[10px] text-white/40 lowercase">
                      enforces 4s breathing reflection before opening
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateApp(selectedApp.id, {
                        mindfulDelay: !selectedApp.mindfulDelay,
                      })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-mono lowercase transition-all ${
                      selectedApp.mindfulDelay
                        ? "bg-amber-400 text-[#050f2d] font-bold"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {selectedApp.mindfulDelay ? "active" : "off"}
                  </button>
                </div>

                {/* Focus Modes Assignment (from Dumb Phone by Michael Tigas) */}
                <div className="pt-2 border-t border-white/5">
                  <label className="text-[11px] text-white/50 block mb-1.5 lowercase">
                    active in focus modes:
                  </label>
                  <div className="flex gap-1.5">
                    {MODES.map((mode) => {
                      const isActive = (selectedApp.modes || ["all"]).includes(mode);
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => toggleModeForApp(mode)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono lowercase transition-all ${
                            isActive
                              ? "bg-white text-[#050f2d] font-bold"
                              : "bg-white/10 text-white/50 hover:text-white"
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bespoke Widget Configuration For This App */}
              <div className="p-4 rounded-2xl bg-white/[0.04] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                    bespoke widget for &quot;{selectedApp.label}&quot;
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWidgetId(selectedApp.id);
                      setIsCustomizing(false);
                    }}
                    className="text-xs font-mono text-sky-400 hover:text-sky-300 lowercase"
                  >
                    preview on top ➔
                  </button>
                </div>

                {/* Choose Widget Type */}
                <div>
                  <label className="text-[11px] text-white/50 block mb-1.5 lowercase">
                    widget presentation model
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {WIDGET_TYPES.map((wt) => (
                      <button
                        key={wt.type}
                        type="button"
                        onClick={() =>
                          updateAppWidget(selectedApp.id, {
                            ...selectedApp.widget,
                            type: wt.type,
                            title: `${selectedApp.label} ${wt.label}`,
                          })
                        }
                        className={`p-2.5 rounded-xl text-left transition-all flex flex-col ${
                          selectedApp.widget.type === wt.type
                            ? "bg-white text-[#050f2d] font-bold shadow-md"
                            : "bg-white/[0.05] text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xs capitalize">{wt.label}</span>
                        <span className="text-[10px] opacity-70 leading-tight mt-0.5">
                          {wt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Widget Content Fields */}
                <div className="flex flex-col gap-2.5 mt-2 pt-2 border-t border-white/5">
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1 lowercase">
                      widget title
                    </label>
                    <input
                      type="text"
                      value={selectedApp.widget.title}
                      onChange={(e) =>
                        updateAppWidget(selectedApp.id, {
                          ...selectedApp.widget,
                          title: e.target.value.toLowerCase(),
                        })
                      }
                      className="w-full bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white font-medium outline-none lowercase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-white/50 block mb-1 lowercase">
                      primary content / memo / value
                    </label>
                    <input
                      type="text"
                      value={selectedApp.widget.value}
                      onChange={(e) =>
                        updateAppWidget(selectedApp.id, {
                          ...selectedApp.widget,
                          value: e.target.value,
                        })
                      }
                      className="w-full bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-white/50 block mb-1 lowercase">
                      secondary subtitle or deep link detail
                    </label>
                    <input
                      type="text"
                      value={selectedApp.widget.detail || selectedApp.widget.subtitle || ""}
                      onChange={(e) =>
                        updateAppWidget(selectedApp.id, {
                          ...selectedApp.widget,
                          detail: e.target.value,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="e.g. tel:18005550199 or transit details"
                      className="w-full bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Reset Factory Defaults */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset launcher apps & widgets to original factory defaults?")) {
                  resetDefaults();
                }
              }}
              className="text-xs text-white/30 hover:text-rose-400 lowercase transition-colors font-mono"
            >
              restore factory presets
            </button>
            <span className="text-[11px] text-white/30 font-mono lowercase">
              synced to pwa storage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
