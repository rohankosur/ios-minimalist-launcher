"use client";

import React from "react";
import { WidgetInstance } from "@/types/launcher";
import ClockWidget from "./ClockWidget";
import WeatherWidget from "./WeatherWidget";
import TasksWidget from "./TasksWidget";
import QuoteWidget from "./QuoteWidget";
import ScratchpadWidget from "./ScratchpadWidget";
import HabitsWidget from "./HabitsWidget";
import NowPlayingWidget from "./NowPlayingWidget";
import TelemetryWidget from "./TelemetryWidget";
import CountdownWidget from "./CountdownWidget";

interface WidgetRendererProps {
  widget: WidgetInstance;
}

export default function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.kind) {
    case "clock":
      return <ClockWidget widget={widget} />;
    case "weather":
      return <WeatherWidget widget={widget} />;
    case "tasks":
      return <TasksWidget widget={widget} />;
    case "quote":
      return <QuoteWidget widget={widget} />;
    case "scratchpad":
      return <ScratchpadWidget widget={widget} />;
    case "habits":
      return <HabitsWidget widget={widget} />;
    case "now_playing":
      return <NowPlayingWidget widget={widget} />;
    case "telemetry":
      return <TelemetryWidget widget={widget} />;
    case "countdown":
      return <CountdownWidget widget={widget} />;
    default:
      return <ClockWidget widget={widget} />;
  }
}
