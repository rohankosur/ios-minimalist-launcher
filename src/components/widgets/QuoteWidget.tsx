"use client";

import React, { useState } from "react";
import { WidgetInstance } from "@/types/launcher";
import { STOIC_QUOTES } from "@/lib/defaultWidgets";
import { useLauncher } from "@/context/LauncherContext";

interface QuoteWidgetProps {
  widget: WidgetInstance;
}

export default function QuoteWidget({ widget }: QuoteWidgetProps) {
  const { updateWidget } = useLauncher();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = widget.config.quoteText || STOIC_QUOTES[quoteIndex].quote;
  const currentAuthor = widget.config.quoteAuthor || STOIC_QUOTES[quoteIndex].author;

  const shuffleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (quoteIndex + 1) % STOIC_QUOTES.length;
    setQuoteIndex(nextIdx);
    updateWidget(widget.id, {
      config: {
        ...widget.config,
        quoteText: STOIC_QUOTES[nextIdx].quote,
        quoteAuthor: STOIC_QUOTES[nextIdx].author,
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between text-xs text-white/50 font-mono lowercase">
        <span className="flex items-center gap-1.5 font-bold text-white/85">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{widget.title || "stoic contemplation"}</span>
        </span>
        <button
          type="button"
          onClick={shuffleQuote}
          className="text-[10px] font-mono text-amber-300 hover:text-white px-2 py-0.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 transition-all flex items-center gap-1"
        >
          <span>↻ shuffle</span>
        </button>
      </div>

      <div
        onClick={shuffleQuote}
        className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] active:scale-[0.99] cursor-pointer transition-all flex flex-col gap-1"
      >
        <p className="text-xs sm:text-sm font-semibold text-white/95 lowercase italic leading-relaxed">
          &quot;{currentQuote}&quot;
        </p>
        <span className="text-[10px] text-white/45 font-mono lowercase self-end mt-0.5">
          — {currentAuthor}
        </span>
      </div>
    </div>
  );
}
