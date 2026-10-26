"use client";

import React, { useState, useMemo } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { PRESET_LIBRARY } from "@/lib/defaultConfig";

export default function AppSearchDrawer() {
  const { apps, isSearchOpen, setIsSearchOpen, recordAppOpen } = useLauncher();
  const [query, setQuery] = useState("");

  // Merge installed apps and system preset apps
  const allSearchable = useMemo(() => {
    const list = [...apps];
    for (const preset of PRESET_LIBRARY) {
      if (!list.some((a) => a.label.toLowerCase() === preset.label.toLowerCase())) {
        list.push({
          id: `preset_${preset.label}`,
          label: preset.label,
          scheme: preset.scheme,
          description: preset.description,
          enabled: true,
          widget: preset.defaultWidget,
        });
      }
    }
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, [apps]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allSearchable;
    return allSearchable.filter((a) =>
      a.label.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [allSearchable, query]);

  if (!isSearchOpen) return null;

  const handleLaunch = (scheme: string) => {
    recordAppOpen();
    setIsSearchOpen(false);
    window.location.href = scheme;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md mx-auto h-[80vh] rounded-t-[36px] flex flex-col overflow-hidden text-white shadow-2xl"
        style={{
          backgroundColor: "rgba(5, 15, 45, 0.9)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: "none",
        }}
      >
        {/* Search Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between gap-3">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="type app name (intentional friction)..."
            className="flex-1 bg-white/[0.08] px-4 py-2.5 rounded-2xl text-white text-sm font-semibold placeholder:text-white/30 outline-none lowercase"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold lowercase transition-all"
          >
            close
          </button>
        </div>

        {/* Filtered App List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40 font-mono lowercase">
              no apps matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLaunch(item.scheme)}
                className="w-full flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-white/[0.06] active:opacity-30 transition-all text-left"
              >
                <span className="text-xl font-extrabold text-white lowercase">
                  {item.label}
                </span>
                <span className="text-xs font-mono text-white/30">
                  {item.scheme}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
