"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useLauncher } from "@/context/LauncherContext";
import { PRESET_LIBRARY } from "@/lib/defaultConfig";

export default function AppSearchDrawer() {
  const { apps, isSearchOpen, setIsSearchOpen, recordAppOpen } = useLauncher();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered.length > 0) {
      handleLaunch(filtered[0].scheme);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200 select-none cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-auto h-[82vh] rounded-t-[36px] flex flex-col overflow-hidden text-white shadow-2xl cursor-default"
        style={{
          backgroundColor: "rgba(5, 15, 45, 0.94)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "none",
        }}
      >
        {/* Search Header Form */}
        <form
          onSubmit={handleFormSubmit}
          className="p-6 pb-4 border-b border-white/10 flex items-center justify-between gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="type to launch (intentional friction)..."
              className="w-full bg-white/[0.08] px-4 py-2.5 rounded-2xl text-white text-sm font-semibold placeholder:text-white/30 outline-none lowercase pr-8"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold lowercase transition-all"
          >
            close
          </button>
        </form>

        {/* Filtered App List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/40 font-mono lowercase">
              no applications matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLaunch(item.scheme)}
                className={`w-full flex items-center justify-between py-3 px-3.5 rounded-2xl transition-all text-left ${
                  idx === 0 && query
                    ? "bg-white/15 text-white shadow-sm"
                    : "hover:bg-white/[0.06] active:opacity-30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-extrabold text-white lowercase">
                    {item.label}
                  </span>
                  {idx === 0 && query && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white/80">
                      return ↵
                    </span>
                  )}
                </div>
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
