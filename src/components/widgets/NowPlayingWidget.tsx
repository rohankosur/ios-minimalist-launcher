"use client";

import React, { useState, useEffect, useRef } from "react";
import { WidgetInstance } from "@/types/launcher";
import { useLauncher } from "@/context/LauncherContext";

interface NowPlayingWidgetProps {
  widget: WidgetInstance;
}

const FREQUENCY_PRESETS = [
  { freq: 108, name: "108hz space drone", short: "108hz" },
  { freq: 432, name: "432hz harmonic flow", short: "432hz" },
  { freq: 528, name: "528hz miracle focus", short: "528hz" },
  { freq: 174, name: "174hz grounding calm", short: "174hz" },
];

export default function NowPlayingWidget({ widget }: NowPlayingWidgetProps) {
  const { showToast } = useLauncher();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState(108);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscHarmonicRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAudio = (freq: number) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      oscHarmonic.type = "triangle";
      oscHarmonic.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.2);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscHarmonic.start();

      oscRef.current = osc;
      oscHarmonicRef.current = oscHarmonic;
      gainRef.current = gain;

      setIsPlaying(true);
      showToast(`synthesizing ${freq}Hz ambient frequency`);
    } catch (err) {
      console.warn("Audio synthesis error:", err);
    }
  };

  const stopAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
      setTimeout(() => {
        try {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          oscHarmonicRef.current?.stop();
          oscHarmonicRef.current?.disconnect();
          audioCtxRef.current?.close();
        } catch {}
        audioCtxRef.current = null;
      }, 300);
    }
    setIsPlaying(false);
    showToast("ambient audio paused");
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(selectedFreq);
    }
  };

  const changeFrequency = (freq: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFreq(freq);
    if (isPlaying && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.1);
      if (oscHarmonicRef.current) {
        oscHarmonicRef.current.frequency.setTargetAtTime(freq * 1.5, audioCtxRef.current.currentTime, 0.1);
      }
      showToast(`tuned to ${freq}Hz`);
    } else if (!isPlaying) {
      startAudio(freq);
    }
  };

  const launchApp = (scheme: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`launching ${label} (${scheme})`);
    if (typeof window !== "undefined") {
      window.location.href = scheme;
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const activePreset = FREQUENCY_PRESETS.find((p) => p.freq === selectedFreq) || FREQUENCY_PRESETS[0];

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/30"
            }`}
          />
          <span>{widget.title || "ambient soundscape"}</span>
        </span>

        {/* Streaming App Quick Launchers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => launchApp("spotify://", "spotify", e)}
            className="text-[10px] text-emerald-400/80 hover:text-emerald-300 font-mono underline"
          >
            spotify
          </button>
          <span className="text-white/20">•</span>
          <button
            type="button"
            onClick={(e) => launchApp("music://", "apple music", e)}
            className="text-[10px] text-rose-300/80 hover:text-rose-300 font-mono underline"
          >
            music
          </button>
          <span className="text-white/20">•</span>
          <button
            type="button"
            onClick={(e) => launchApp("podcasts://", "podcasts", e)}
            className="text-[10px] text-purple-300/80 hover:text-purple-300 font-mono underline"
          >
            podcasts
          </button>
        </div>
      </div>

      {/* Main Synthesizer Card */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.06] transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 max-w-[75%]">
            {/* Visualizer bars */}
            <div className="flex items-end gap-1 h-5 w-4 shrink-0">
              <span
                className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${
                  isPlaying ? "h-full animate-bounce" : "h-1 opacity-30"
                }`}
              />
              <span
                className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 delay-100 ${
                  isPlaying ? "h-3/4 animate-bounce" : "h-1 opacity-30"
                }`}
              />
              <span
                className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 delay-200 ${
                  isPlaying ? "h-4/5 animate-bounce" : "h-1 opacity-30"
                }`}
              />
            </div>

            <div className="flex flex-col truncate">
              <span className="text-sm sm:text-base font-bold text-white lowercase truncate">
                {activePreset.name}
              </span>
              <span className="text-[11px] text-white/40 lowercase truncate font-mono">
                {isPlaying ? "offline audio synthesizer active • harmonic flow" : "tap play or select frequency below"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white text-xs font-bold transition-all shrink-0 shadow-lg"
            title={isPlaying ? "Pause frequency" : "Play ambient frequency"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>

        {/* Frequency selector buttons */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5">
          {FREQUENCY_PRESETS.map((p) => (
            <button
              key={p.freq}
              type="button"
              onClick={(e) => changeFrequency(p.freq, e)}
              className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono transition-all text-center active:scale-95 ${
                selectedFreq === p.freq
                  ? "bg-white/20 text-white font-bold"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {p.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
