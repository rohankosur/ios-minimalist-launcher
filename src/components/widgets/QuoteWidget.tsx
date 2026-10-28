"use client";

import React, { useState } from "react";
import { WidgetInstance } from "@/types/launcher";
import { STOIC_QUOTES } from "@/lib/defaultWidgets";
import { useLauncher } from "@/context/LauncherContext";

interface QuoteWidgetProps {
  widget: WidgetInstance;
}

export default function QuoteWidget({ widget }: QuoteWidgetProps) {
  const { updateWidget, showToast } = useLauncher();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const currentQuote = widget.config.quoteText || STOIC_QUOTES[quoteIndex].quote;
  const currentAuthor = widget.config.quoteAuthor || STOIC_QUOTES[quoteIndex].author;

  const cycle = (step: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextIdx = (quoteIndex + step + STOIC_QUOTES.length) % STOIC_QUOTES.length;
    setQuoteIndex(nextIdx);
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        quoteText: STOIC_QUOTES[nextIdx].quote,
        quoteAuthor: STOIC_QUOTES[nextIdx].author,
      },
    });
  };

  const copyQuoteToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `"${currentQuote}" — ${currentAuthor}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        showToast("quote copied to clipboard 📋");
      }).catch(() => {
        showToast("copied quote");
      });
    } else {
      showToast("quote copied");
    }
  };

  const openAppleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast("opening apple notes (mobilenotes:)");
    if (typeof window !== "undefined") {
      window.location.href = "mobilenotes://";
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    showToast(!isFavorited ? "saved to favorites ★" : "removed from favorites");
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{widget.title || "stoic contemplation"}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => cycle(-1, e)}
            className="p-1 text-white/50 hover:text-white active:scale-90 text-[10px] font-mono"
            title="Previous quote"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(e) => cycle(1, e)}
            className="text-[10px] font-mono text-amber-300 hover:text-white px-2 py-0.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 active:scale-95 transition-all flex items-center gap-1"
          >
            ↻ shuffle
          </button>
          <button
            type="button"
            onClick={(e) => cycle(1, e)}
            className="p-1 text-white/50 hover:text-white active:scale-90 text-[10px] font-mono"
            title="Next quote"
          >
            →
          </button>
        </div>
      </div>

      {/* Main Quote Card */}
      <div
        onClick={copyQuoteToClipboard}
        className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] active:scale-[0.985] cursor-pointer transition-all flex flex-col gap-1 group"
        title="Tap to copy quote to clipboard"
      >
        <p className="text-xs sm:text-sm font-semibold text-white/95 lowercase italic leading-relaxed">
          &quot;{currentQuote}&quot;
        </p>

        <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyQuoteToClipboard}
              className="text-[10px] font-mono text-white/40 hover:text-white transition-colors"
            >
              📋 copy
            </button>
            <button
              type="button"
              onClick={openAppleNotes}
              className="text-[10px] font-mono text-white/40 hover:text-amber-300 transition-colors"
            >
              📝 notes ➔
            </button>
            <button
              type="button"
              onClick={toggleFavorite}
              className={`text-[10px] font-mono transition-colors ${
                isFavorited ? "text-amber-300" : "text-white/40 hover:text-amber-300"
              }`}
            >
              {isFavorited ? "★ saved" : "☆ star"}
            </button>
          </div>

          <span className="text-[10px] text-white/45 font-mono lowercase">
            — {currentAuthor}
          </span>
        </div>
      </div>
    </div>
  );
}
