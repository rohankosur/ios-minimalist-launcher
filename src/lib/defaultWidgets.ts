import { WidgetInstance, WidgetKind } from "@/types/launcher";

export const STOIC_QUOTES = [
  {
    quote: "you have power over your mind - not outside events.",
    author: "marcus aurelius",
  },
  {
    quote: "we suffer more often in imagination than in reality.",
    author: "seneca",
  },
  {
    quote: "no person is free who is not master of oneself.",
    author: "epictetus",
  },
  {
    quote: "the happiness of your life depends upon the quality of your thoughts.",
    author: "marcus aurelius",
  },
  {
    quote: "it is not that we have a short time to live, but that we waste a lot of it.",
    author: "seneca",
  },
  {
    quote: "waste no more time arguing about what a good man should be. be one.",
    author: "marcus aurelius",
  },
  {
    quote: "simplicity is the ultimate sophistication.",
    author: "leonardo da vinci",
  },
  {
    quote: "silence is a source of great strength.",
    author: "lao tzu",
  },
];

export const DEFAULT_WIDGETS: WidgetInstance[] = [
  {
    id: "widget_clock",
    kind: "clock",
    title: "system clock",
    subtitle: "orbital time & battery",
    enabled: true,
    order: 0,
    config: {
      showBattery: true,
      showOpens: true,
    },
  },
  {
    id: "widget_weather",
    kind: "weather",
    title: "atmosphere",
    subtitle: "local atmospheric readings",
    enabled: true,
    order: 1,
    config: {
      temp: "72°",
      condition: "clear sky",
      location: "local telemetry",
      unit: "F",
    },
  },
  {
    id: "widget_tasks",
    kind: "tasks",
    title: "daily focus",
    subtitle: "mindful checklist",
    enabled: true,
    order: 2,
    config: {
      tasks: [
        { id: "t1", text: "10-minute morning breathwork", completed: true },
        { id: "t2", text: "deep work block (no notifications)", completed: false },
        { id: "t3", text: "review evening telemetry & journal", completed: false },
      ],
    },
  },
  {
    id: "widget_quote",
    kind: "quote",
    title: "stoic quote",
    subtitle: "daily contemplation",
    enabled: true,
    order: 3,
    config: {
      quoteText: "you have power over your mind - not outside events.",
      quoteAuthor: "marcus aurelius",
    },
  },
  {
    id: "widget_scratchpad",
    kind: "scratchpad",
    title: "scratchpad",
    subtitle: "quick persistent memo",
    enabled: true,
    order: 4,
    config: {
      memoText: "capture thoughts cleanly • protect attention with relentless focus",
    },
  },
  {
    id: "widget_habits",
    kind: "habits",
    title: "habit streak",
    subtitle: "digital minimalism metrics",
    enabled: true,
    order: 5,
    config: {
      habits: [
        { id: "h1", name: "no phone in bed", streak: 5, completedToday: true },
        { id: "h2", name: "read 20 pages", streak: 3, completedToday: false },
        { id: "h3", name: "30m outdoor walk", streak: 8, completedToday: false },
      ],
    },
  },
  {
    id: "widget_now_playing",
    kind: "now_playing",
    title: "ambient sound",
    subtitle: "offline frequency generator",
    enabled: true,
    order: 6,
    config: {
      ambientPreset: "deep_space",
    },
  },
  {
    id: "widget_telemetry",
    kind: "telemetry",
    title: "device telemetry",
    subtitle: "system kernel metrics",
    enabled: true,
    order: 7,
    config: {
      showBattery: true,
      showOpens: true,
    },
  },
];

export interface WidgetCatalogItem {
  kind: WidgetKind;
  title: string;
  category: "core" | "productivity" | "mindfulness" | "ambient";
  description: string;
  defaultConfig: WidgetInstance["config"];
}

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    kind: "clock",
    title: "system clock",
    category: "core",
    description: "Bold SF Pro digital time, date, battery charge bolt & celestial status.",
    defaultConfig: { showBattery: true, showOpens: true },
  },
  {
    kind: "weather",
    title: "weather conditions",
    category: "core",
    description: "Atmospheric conditions, live temperature, humidity, and location.",
    defaultConfig: { temp: "72°", condition: "clear sky", location: "local telemetry", unit: "F" },
  },
  {
    kind: "tasks",
    title: "tasks & todo checklist",
    category: "productivity",
    description: "Interactive task list with one-tap checkboxes, add & remove items.",
    defaultConfig: {
      tasks: [
        { id: "t1", text: "morning deep reflection", completed: false },
        { id: "t2", text: "complete daily priority goal", completed: false },
      ],
    },
  },
  {
    kind: "quote",
    title: "stoic contemplation",
    category: "mindfulness",
    description: "Daily philosophical quotes from Marcus Aurelius, Seneca, Epictetus & Lao Tzu.",
    defaultConfig: {
      quoteText: "you have power over your mind - not outside events.",
      quoteAuthor: "marcus aurelius",
    },
  },
  {
    kind: "scratchpad",
    title: "quick scratchpad memo",
    category: "productivity",
    description: "Instant auto-saving notes pad persisted directly to device storage.",
    defaultConfig: { memoText: "" },
  },
  {
    kind: "habits",
    title: "habit & streak tracker",
    category: "mindfulness",
    description: "Daily streaks for mindful phone use, meditation, reading & hydration.",
    defaultConfig: {
      habits: [
        { id: "h1", name: "no social media", streak: 7, completedToday: false },
        { id: "h2", name: "evening reflection", streak: 4, completedToday: false },
      ],
    },
  },
  {
    kind: "now_playing",
    title: "ambient audio generator",
    category: "ambient",
    description: "Real-time synthesized celestial space drone & zen audio frequencies.",
    defaultConfig: { ambientPreset: "deep_space" },
  },
  {
    kind: "telemetry",
    title: "device telemetry",
    category: "core",
    description: "Battery telemetry, hardware state, network status & daily opens tracker.",
    defaultConfig: { showBattery: true, showOpens: true },
  },
  {
    kind: "agenda",
    title: "calendar itinerary",
    category: "productivity",
    description: "Countdown to next sync, meeting, or scheduled itinerary event.",
    defaultConfig: {
      memoText: "16:30 • product sync & design review",
    },
  },
  {
    kind: "countdown",
    title: "milestone countdown",
    category: "productivity",
    description: "Days & hours countdown to an important personal target or deadline.",
    defaultConfig: {
      targetEvent: "product launch",
      targetDate: new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0],
    },
  },
  {
    kind: "contact",
    title: "speed contact",
    category: "core",
    description: "One-tap direct dial for emergency or primary contact.",
    defaultConfig: {
      contactName: "emergency / priority line",
      contactNumber: "tel:911",
    },
  },
];
