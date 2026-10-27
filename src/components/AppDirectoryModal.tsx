"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { IOS_APP_DATABASE, DatabaseApp } from "@/lib/iosAppDatabase";

type CategoryFilter =
  | "all"
  | "apple"
  | "chat"
  | "social"
  | "media"
  | "productivity"
  | "travel"
  | "finance"
  | "reading"
  | "health";

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "all apps" },
  { id: "apple", label: "apple native" },
  { id: "chat", label: "chat & messaging" },
  { id: "social", label: "social media" },
  { id: "media", label: "media & music" },
  { id: "productivity", label: "productivity" },
  { id: "travel", label: "travel & maps" },
  { id: "finance", label: "finance" },
  { id: "reading", label: "reading" },
  { id: "health", label: "health & mindful" },
];

export default function AppDirectoryModal() {
  const {
    apps,
    addApp,
    deleteApp,
    isAppDirectoryOpen,
    setIsAppDirectoryOpen,
    settings,
  } = useLauncher();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [customName, setCustomName] = useState("");
  const [customScheme, setCustomScheme] = useState("");
  const [isShortcutBridge, setIsShortcutBridge] = useState(false);

  useEffect(() => {
    if (!isAppDirectoryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAppDirectoryOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAppDirectoryOpen, setIsAppDirectoryOpen]);

  // Set of schemes already in launcher
  const addedSchemes = useMemo(() => {
    return new Set(apps.map((a) => a.scheme.toLowerCase()));
  }, [apps]);

  const addedLabels = useMemo(() => {
    return new Set(apps.map((a) => a.label.toLowerCase()));
  }, [apps]);

  // Filtered apps based on search & category
  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return IOS_APP_DATABASE.filter((app) => {
      const matchesCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.scheme.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isAppDirectoryOpen) return null;

  const handleAddApp = (dbApp: DatabaseApp) => {
    addApp({
      label: dbApp.name.toLowerCase(),
      scheme: dbApp.scheme,
      description: dbApp.description,
      category: dbApp.category,
      enabled: true,
      mindfulDelay: false,
      modes: ["all", "essential", "personal"],
      widget: dbApp.defaultWidget,
    });
  };

  const handleRemoveApp = (dbApp: DatabaseApp) => {
    const matched = apps.find(
      (a) =>
        a.scheme.toLowerCase() === dbApp.scheme.toLowerCase() ||
        a.label.toLowerCase() === dbApp.name.toLowerCase()
    );
    if (matched) {
      deleteApp(matched.id);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const trimmedName = customName.trim().toLowerCase();
    const finalScheme = isShortcutBridge
      ? `shortcuts://run-shortcut?name=${encodeURIComponent(customName.trim())}`
      : customScheme.trim() || `${trimmedName}://`;

    addApp({
      label: trimmedName,
      scheme: finalScheme,
      description: isShortcutBridge ? "Apple Shortcut Bridge" : "Custom Application",
      category: "custom",
      enabled: true,
      mindfulDelay: false,
      modes: ["all"],
      widget: {
        type: "telemetry",
        title: `${trimmedName} widget`,
        subtitle: "custom quick action",
        value: "ready for launch",
        detail: finalScheme,
      },
    });

    setCustomName("");
    setCustomScheme("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Searchable iOS App Directory"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsAppDirectoryOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] flex flex-col overflow-hidden text-white shadow-2xl cursor-default"
        style={{
          backgroundColor: settings.oledMode ? "rgba(10, 10, 10, 0.96)" : "rgba(5, 15, 45, 0.95)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight lowercase">
              ios app directory
            </h2>
            <p className="text-xs text-white/50 lowercase">
              instant one-tap add • 60+ pre-indexed apps
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAppDirectoryOpen(false)}
            className="px-4 py-1.5 rounded-full bg-white text-[#050f2d] hover:bg-white/90 active:scale-95 text-xs font-bold lowercase transition-all"
          >
            done
          </button>
        </div>

        {/* Live Search Input */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-white/40 text-sm">🔍</span>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search any app (e.g. spotify, whatsapp, camera)..."
              className="w-full bg-white/[0.08] focus:bg-white/[0.12] pl-10 pr-4 py-2.5 rounded-2xl text-sm text-white placeholder:text-white/40 outline-none border border-white/5 transition-all lowercase"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-white/40 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-6 py-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-mono lowercase transition-all ${
                selectedCategory === cat.id
                  ? "bg-white text-[#050f2d] font-bold shadow-sm"
                  : "bg-white/[0.06] text-white/60 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* App Directory List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 flex flex-col gap-2">
          <div className="text-[11px] font-mono text-white/40 flex items-center justify-between pb-1">
            <span>
              showing {filteredApps.length} apps • {apps.length} active on launcher
            </span>
            <span>1-tap to add</span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.03] text-center flex flex-col items-center gap-2">
              <span className="text-2xl">🔍</span>
              <p className="text-xs text-white/60 lowercase font-medium">
                no indexed app matching &quot;{searchQuery}&quot;
              </p>
              <p className="text-[11px] text-white/40 lowercase max-w-xs">
                use the custom app creator below to add it via direct URL scheme or Apple Shortcut!
              </p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const isAdded =
                addedSchemes.has(app.scheme.toLowerCase()) ||
                addedLabels.has(app.name.toLowerCase());

              return (
                <div
                  key={app.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isAdded
                      ? "bg-white/[0.07] border-white/20"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white lowercase">
                        {app.name}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/50">
                        {app.category}
                      </span>
                      {isAdded && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          ✓ on launcher
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/50 lowercase truncate">
                      {app.description} •{" "}
                      <code className="text-white/35 font-mono text-[10px]">
                        {app.scheme}
                      </code>
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isAdded ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveApp(app)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-xs font-mono font-medium lowercase transition-all active:scale-95"
                      >
                        remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddApp(app)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#050f2d] text-xs font-bold lowercase transition-all active:scale-95 shadow-sm"
                      >
                        + add
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Custom App / Shortcut Bridge Creator */}
          <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/50">
                + add any custom app or apple shortcut
              </span>
              <button
                type="button"
                onClick={() => setIsShortcutBridge(!isShortcutBridge)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono lowercase transition-all ${
                  isShortcutBridge
                    ? "bg-violet-400 text-[#050f2d] font-bold"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {isShortcutBridge ? "siri shortcut mode" : "direct url scheme"}
              </button>
            </div>

            <p className="text-[11px] text-white/50 leading-snug">
              {isShortcutBridge
                ? "Bypasses URL scheme restrictions! Creates an official Apple Shortcut bridge. Make a shortcut in iOS named exactly as you type here (e.g. 'Open Duolingo')."
                : "Enter any app name and its kinetic iOS URI scheme (e.g. duolingo:// or myapp://)."}
            </p>

            <form onSubmit={handleAddCustom} className="flex flex-col gap-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="app display name (e.g. duolingo)"
                  className="flex-1 bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/40 outline-none lowercase"
                />
                {!isShortcutBridge && (
                  <input
                    type="text"
                    value={customScheme}
                    onChange={(e) => setCustomScheme(e.target.value)}
                    placeholder="scheme:// (e.g. duolingo://)"
                    className="flex-1 bg-white/[0.08] px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/40 outline-none"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#050f2d] font-bold text-xs lowercase transition-all active:scale-95"
              >
                + add custom app to launcher
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
