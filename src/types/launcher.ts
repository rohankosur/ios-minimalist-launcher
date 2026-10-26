export type WidgetType =
  | "clock"
  | "scratchpad"
  | "contact"
  | "sms_quick"
  | "now_playing"
  | "directions"
  | "telemetry"
  | "agenda";

export interface AppWidgetItem {
  id: string;
  label: string; // e.g. "phone", "messages", "notes"
  scheme: string; // e.g. "tel:", "sms:", "mobilenotes://"
  description?: string;
  category?: string;
  enabled: boolean;
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
