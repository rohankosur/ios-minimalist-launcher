"use client";

import React, { useState } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface ContactWidgetProps {
  widget: WidgetInstance;
}

export default function ContactWidget({ widget }: ContactWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(widget.config.contactName || "emergency line");
  const [number, setNumber] = useState(widget.config.contactNumber || "911");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        contactName: name,
        contactNumber: number,
      },
    });
    setIsEditing(false);
    showToast(`saved contact "${name}"`);
  };

  const dialPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`dialing ${name} (${number})...`);
    if (typeof window !== "undefined") {
      window.location.href = `tel:${number}`;
    }
  };

  const sendSms = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`messaging ${name}...`);
    if (typeof window !== "undefined") {
      window.location.href = `sms:${number}`;
    }
  };

  const openFaceTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`facetime calling ${name}...`);
    if (typeof window !== "undefined") {
      window.location.href = `facetime:${number}`;
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>{widget.title || "speed contact"}</span>
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-[10px] font-mono text-rose-300 hover:text-white px-2 py-0.5 rounded-full bg-rose-400/10 active:scale-95 transition-all"
        >
          {isEditing ? "done" : "✎ edit"}
        </button>
      </div>

      {/* Main Container */}
      <div className="p-3 rounded-2xl bg-white/[0.06] flex flex-col gap-2">
        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contact name..."
              className="bg-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white outline-none"
            />
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="phone number (e.g. 5551234567)..."
              className="bg-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white font-mono outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-rose-400 text-[#050f2d] text-xs font-bold lowercase self-end"
            >
              save contact
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex flex-col truncate max-w-[60%]">
              <span className="text-base font-bold text-white lowercase truncate">
                {name}
              </span>
              <span className="text-xs text-white/40 font-mono">
                {number}
              </span>
            </div>

            {/* Kinetic 1-Tap Communication Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={dialPhone}
                className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 active:scale-95 flex items-center justify-center text-xs font-bold transition-all"
                title={`Call ${name}`}
              >
                📞
              </button>
              <button
                type="button"
                onClick={sendSms}
                className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 active:scale-95 flex items-center justify-center text-xs font-bold transition-all"
                title={`Message ${name}`}
              >
                💬
              </button>
              <button
                type="button"
                onClick={openFaceTime}
                className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 active:scale-95 flex items-center justify-center text-xs font-bold transition-all"
                title={`FaceTime ${name}`}
              >
                📹
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
