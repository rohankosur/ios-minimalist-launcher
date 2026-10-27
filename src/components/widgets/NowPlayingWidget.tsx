"use client";

import React, { useState, useEffect, useRef } from "react";
import { WidgetInstance } from "@/types/launcher";

interface NowPlayingWidgetProps {
  widget: WidgetInstance;
}

export default function NowPlayingWidget({ widget }: NowPlayingWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
        setTimeout(() => {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 300);
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Celestial ambient frequency: gentle 432 Hz / 108 Hz drone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(108, ctx.currentTime);

        // Low volume ambient drone
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio synthesis error:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/30"
            }`}
          />
          <span>{widget.title || "ambient soundscape"}</span>
        </span>
        <a
          href="spotify://"
          className="text-white/60 hover:text-white underline underline-offset-2 pointer-events-auto text-[10px]"
        >
          launch spotify
        </a>
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] transition-all">
        <div className="flex items-center gap-3 max-w-[75%]">
          {/* Animated visualizer bars */}
          <div className="flex items-end gap-1 h-4 w-3.5 shrink-0">
            <span
              className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 ${
                isPlaying ? "h-full animate-bounce" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 delay-100 ${
                isPlaying ? "h-3/4 animate-bounce" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 delay-200 ${
                isPlaying ? "h-4/5 animate-bounce" : "h-1 opacity-40"
              }`}
            />
          </div>

          <div className="flex flex-col truncate">
            <span className="text-sm sm:text-base font-bold text-white lowercase truncate">
              {isPlaying ? "deep space 108hz" : "celestial ambient generator"}
            </span>
            <span className="text-[11px] text-white/40 lowercase truncate font-mono">
              {isPlaying ? "audio session active • 432hz harmonic" : "tap play to synthesize sound"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white text-xs font-bold transition-all shrink-0"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
    </div>
  );
}
