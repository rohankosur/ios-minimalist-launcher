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
    setActiveWidgetIndex,
    isWidgetModalOpen,
    setIsWidgetModalOpen,
    settings,
    setWidgetLayout,
    showToast,
  } = useLauncher();

  const [activeTab, setActiveTab] = useState<"catalog" | "active" | "ios_guide">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isWidgetModalOpen) return null;

  // Filter catalog by search query
  const filteredCatalog = WIDGET_CATALOG.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyScriptable = (type: "clock" | "quote" | "hub") => {
    let script = "";
    if (type === "clock") {
      script = `// Minimalist Clock & Battery iOS Widget
let widget = new ListWidget();
widget.backgroundColor = new Color("#050f2d");

let now = new Date();
let hours = now.getHours().toString().padStart(2, "0");
let minutes = now.getMinutes().toString().padStart(2, "0");

let timeText = widget.addText(\`\${hours}:\${minutes}\`);
timeText.textColor = Color.white();
timeText.font = Font.boldSystemFont(36);

let options = { weekday: "long", month: "short", day: "numeric" };
let dateText = widget.addText(now.toLocaleDateString("en-US", options).toLowerCase());
dateText.textColor = new Color("#ffffff", 0.6);
dateText.font = Font.systemFont(13);

widget.addSpacer(8);
let batt = Math.round(Device.batteryLevel() * 100);
let battText = widget.addText(\`\${batt}% battery • minimalist\`);
battText.textColor = new Color("#34d399", 0.85);
battText.font = Font.systemFont(11);

widget.url = "https://ios-minimalist-launcher.vercel.app";
Script.setWidget(widget);
Script.complete();`;
    } else if (type === "quote") {
      script = `// Minimalist Stoic Quote iOS Widget
let widget = new ListWidget();
widget.backgroundColor = new Color("#050f2d");

let quotes = [
  { q: "you have power over your mind - not outside events.", a: "marcus aurelius" },
  { q: "we suffer more often in imagination than in reality.", a: "seneca" },
  { q: "no person is free who is not master of oneself.", a: "epictetus" }
];
let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

let qText = widget.addText(\`"\${randomQuote.q}"\`);
qText.textColor = Color.white();
qText.font = Font.italicSystemFont(14);

widget.addSpacer(6);
let aText = widget.addText(\`— \${randomQuote.a}\`);
aText.textColor = new Color("#fbbf24", 0.7);
aText.font = Font.systemFont(11);

widget.url = "https://ios-minimalist-launcher.vercel.app";
Script.setWidget(widget);
Script.complete();`;
    } else {
      script = `// Minimalist Dumbphone App Launcher Hub
let widget = new ListWidget();
widget.backgroundColor = new Color("#000000");

let title = widget.addText("minimalist phone");
title.textColor = Color.white();
title.font = Font.boldSystemFont(18);

widget.addSpacer(6);
let l1 = widget.addText("• phone • messages • notes");
l1.textColor = new Color("#ffffff", 0.7);
l1.font = Font.systemFont(13);

widget.addSpacer(4);
let l2 = widget.addText("• weather • focus • spotify");
l2.textColor = new Color("#ffffff", 0.5);
l2.font = Font.systemFont(13);

widget.url = "https://ios-minimalist-launcher.vercel.app";
Script.setWidget(widget);
Script.complete();`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(script).then(() => {
        setCopiedType(type);
        showToast("scriptable code copied to clipboard 📋");
        setTimeout(() => setCopiedType(null), 2500);
      });
    }
  };

  const handleSwitchToExisting = (kind: WidgetKind) => {
    const existingIndex = widgets.findIndex((w) => w.kind === kind);
    if (existingIndex !== -1) {
      setActiveWidgetIndex(existingIndex);
      setIsWidgetModalOpen(false);
      showToast(`switched to ${WIDGET_CATALOG.find((c) => c.kind === kind)?.title || kind}`);
    }
  };

  const handleAddNewInstance = (cat: (typeof WIDGET_CATALOG)[0]) => {
    addWidget(cat.kind);
    setIsWidgetModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Widget Studio & Management"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsWidgetModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] flex flex-col overflow-hidden text-white shadow-2xl cursor-default"
        style={{
          backgroundColor: settings.oledMode ? "rgba(10, 10, 10, 0.98)" : "rgba(5, 15, 45, 0.96)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight lowercase">
              widget studio
            </h2>
            <p className="text-xs text-white/50 lowercase">
              interactive upper deck • ios home screen widgets
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
            active on deck ({widgets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ios_guide")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold lowercase transition-all flex items-center gap-1.5 ${
              activeTab === "ios_guide"
                ? "bg-emerald-400 text-[#050f2d]"
                : "text-emerald-300 hover:text-white bg-emerald-400/10"
            }`}
          >
            <span>iphone home widget</span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 no-scrollbar">
          {/* CATALOG TAB */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-3">
              {/* Important iOS System Explanation Banner */}
              <div
                onClick={() => setActiveTab("ios_guide")}
                className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 hover:bg-sky-500/15 cursor-pointer transition-all flex items-start gap-2.5"
                title="Tap to see how to add native widgets to your iPhone Home Screen"
              >
                <span className="text-base shrink-0 mt-0.5">💡</span>
                <div className="flex flex-col text-xs text-sky-200/90 leading-relaxed">
                  <span className="font-bold text-white">Looking for iPhone Home Screen widgets (jiggle mode &apos;+&apos;)?</span>
                  <span>
                    Apple restricts the native iOS &apos;Add Widget&apos; screen to native App Store apps. Tap here to view the 1-minute <strong>Scriptable</strong> or <strong>Shortcuts</strong> guide!
                  </span>
                </div>
              </div>

              {/* Search & Layout Control Toolbar */}
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search widgets (weather, clock, tasks...)"
                  className="flex-1 bg-white/[0.08] text-xs px-3 py-1.5 rounded-xl text-white placeholder:text-white/40 outline-none"
                />

                <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-lg text-[10px] font-mono shrink-0">
                  <span className="text-white/40 px-1">layout:</span>
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

              {/* Widget Catalog Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredCatalog.map((cat) => {
                  const existingWidget = widgets.find((w) => w.kind === cat.kind);
                  const isAlreadyAdded = Boolean(existingWidget);

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
                          {isAlreadyAdded ? "on top deck" : "ready to add"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isAlreadyAdded ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSwitchToExisting(cat.kind)}
                                className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-mono lowercase transition-all active:scale-95"
                                title="View this widget on the top deck"
                              >
                                view on deck ➔
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddNewInstance(cat)}
                                className="px-2 py-1 rounded-full bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-300 text-[10px] font-mono lowercase transition-all"
                                title="Add another instance"
                              >
                                + copy
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddNewInstance(cat)}
                              className="px-3 py-1 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#050f2d] text-xs font-bold lowercase transition-all active:scale-95"
                            >
                              + add to deck
                            </button>
                          )}
                        </div>
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
                    <div
                      onClick={() => {
                        setActiveWidgetIndex(idx);
                        setIsWidgetModalOpen(false);
                        showToast(`showing ${w.title}`);
                      }}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                      title="Tap to view on top deck"
                    >
                      <span className="text-xs font-mono text-white/30 w-4">
                        {idx + 1}.
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-white lowercase truncate">
                          {w.title}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono lowercase truncate">
                          kind: {w.kind} • {w.enabled ? "visible" : "hidden"}
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

          {/* IOS HOME SCREEN WIDGET GUIDE TAB */}
          {activeTab === "ios_guide" && (
            <div className="flex flex-col gap-3.5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-emerald-300 lowercase">
                  Why isn&apos;t this in the iPhone &apos;Add Widget&apos; screen?
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  Apple&apos;s iOS operating system strictly restricts the native Home Screen widget gallery (the &apos;+&apos; button in jiggle mode) to native App Store apps. <strong>Websites and Safari PWAs cannot place widgets into that menu directly.</strong>
                </p>
                <p className="text-xs text-white/70 leading-relaxed">
                  However, you can get <strong>real native iOS Home Screen widgets</strong> using <strong>Scriptable</strong> or <strong>Shortcuts</strong>:
                </p>
              </div>

              {/* Method 1: Scriptable Widget */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white lowercase">
                    Method 1: Native Scriptable Widgets (Recommended)
                  </span>
                  <a
                    href="https://apps.apple.com/app/scriptable/id1405459188"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-sky-300 font-mono underline"
                  >
                    download scriptable ➔
                  </a>
                </div>

                <div className="flex flex-col gap-2 text-xs text-white/70 leading-relaxed">
                  <p>
                    1. Install free <strong>Scriptable</strong> from the App Store.
                  </p>
                  <p>
                    2. Choose a widget style below and tap <strong>Copy Code</strong>:
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopyScriptable("clock")}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all active:scale-95 ${
                        copiedType === "clock"
                          ? "bg-emerald-400 text-[#050f2d] font-bold"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {copiedType === "clock" ? "✓ copied clock" : "📋 clock & battery"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyScriptable("quote")}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all active:scale-95 ${
                        copiedType === "quote"
                          ? "bg-amber-400 text-[#050f2d] font-bold"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {copiedType === "quote" ? "✓ copied quote" : "📋 stoic quote"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyScriptable("hub")}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all active:scale-95 ${
                        copiedType === "hub"
                          ? "bg-violet-400 text-[#050f2d] font-bold"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {copiedType === "hub" ? "✓ copied hub" : "📋 minimalist hub"}
                    </button>
                  </div>

                  <p className="mt-1">
                    3. Open Scriptable ➔ tap &apos;+&apos; ➔ paste the script ➔ tap Done.
                  </p>
                  <p>
                    4. Go to iPhone Home Screen ➔ long press (jiggle mode) ➔ tap &apos;+&apos; in top left ➔ choose <strong>Scriptable</strong> ➔ select your widget!
                  </p>
                </div>
              </div>

              {/* Method 2: Apple Shortcuts Widget */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col gap-2">
                <span className="text-xs font-bold text-white lowercase">
                  Method 2: Built-in Apple Shortcuts Widget
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  Open the built-in <strong>Shortcuts</strong> app on your iPhone, create a Shortcut with action <em>&quot;Open URL ➔ https://ios-minimalist-launcher.vercel.app&quot;</em>, then in iOS jiggle mode tap &apos;+&apos; and add the <strong>Shortcuts</strong> widget to your home screen!
                </p>
              </div>

              {/* Method 3: PWA Standalone Desktop */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col gap-2">
                <span className="text-xs font-bold text-white lowercase">
                  Method 3: Full-Screen PWA Launcher
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  In Safari, tap <strong>Share</strong> ➔ <strong>Add to Home Screen</strong>. Tapping the launcher icon on your home screen opens your phone directly into this distraction-free dumbphone desktop with the upper-deck widgets always present!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
