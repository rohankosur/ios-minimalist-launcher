export type WidgetType =
  | "clock"
  | "weather"
  | "quote"
  | "scratchpad"
  | "contact"
  | "sms_quick"
  | "now_playing"
  | "directions"
  | "telemetry"
  | "agenda"
  | "tasks"
  | "habits"
  | "countdown";

export type WidgetKind =
  | "clock"
  | "weather"
  | "quote"
  | "tasks"
  | "scratchpad"
  | "habits"
  | "now_playing"
  | "telemetry"
  | "agenda"
  | "contact"
  | "countdown";

export type FocusMode = "essential" | "focus" | "personal" | "all";

export type TextAlignment = "left" | "center" | "right";

export type AppFontSize = "compact" | "normal" | "large";

export type WidgetLayoutMode = "carousel" | "stack";

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface HabitItem {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
}

export interface WidgetConfig {
  // Weather
  temp?: string;
  condition?: string;
  location?: string;
  unit?: "F" | "C";
  weatherView?: "current" | "hourly" | "details";
  // Quote
  quoteText?: string;
  quoteAuthor?: string;
  // Tasks
  tasks?: TaskItem[];
  // Memo
  memoText?: string;
  // Habits
  habits?: HabitItem[];
  // Contact
  contactName?: string;
  contactNumber?: string;
  // Countdown
  targetDate?: string;
  targetEvent?: string;
  // Now Playing
  ambientPreset?: "deep_space" | "cosmic_rain" | "zen_waves" | "harmonic_432" | "miracle_528";
  ambientFrequency?: number;
  // Telemetry
  showBattery?: boolean;
  showOpens?: boolean;
  // Clock options
  timeFormat?: "12h" | "24h";
  showSeconds?: boolean;
  // Agenda
  agendaItems?: Array<{ id: string; time: string; title: string }>;
}

export interface WidgetInstance {
  id: string;
  kind: WidgetKind;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  config: WidgetConfig;
}

export interface AppWidgetItem {
  id: string;
  label: string; // e.g. "phone", "messages", "notes"
  scheme: string; // e.g. "tel:", "sms:", "mobilenotes://"
  description?: string;
  category?: string;
  enabled: boolean;
  mindfulDelay?: boolean; // Dumbphone friction barrier
  modes?: FocusMode[]; // Contextual mode mapping
  widget: {
    type: WidgetType;
    title: string;
    subtitle?: string;
    value: string;
    detail?: string;
  };
}

export interface PresetScheme {
  label: string;
  scheme: string;
  category: string;
  description: string;
  defaultWidget: {
    type: WidgetType;
    title: string;
    subtitle: string;
    value: string;
    detail?: string;
  };
}

export interface DumbPhoneSettings {
  activeMode: FocusMode;
  textAlignment: TextAlignment;
  fontSize: AppFontSize;
  oledMode: boolean; // True OLED Pitch-Black vs Starfield Space Wallpaper
  widgetLayout: WidgetLayoutMode; // carousel vs stack
  globalMindfulDelay: boolean;
  mindfulDelaySeconds: number;
  dailyOpensCount: number;
  lastOpensDate: string;
  detoxStreakDays: number;
}
