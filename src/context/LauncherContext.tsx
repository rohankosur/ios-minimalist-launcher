"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppWidgetItem,
  WidgetType,
  WidgetKind,
  WidgetInstance,
  WidgetLayoutMode,
  FocusMode,
  TextAlignment,
  AppFontSize,
  DumbPhoneSettings,
} from "@/types/launcher";
import { DEFAULT_APPS, DEFAULT_DUMBPHONE_SETTINGS } from "@/lib/defaultConfig";
import { DEFAULT_WIDGETS, WIDGET_CATALOG } from "@/lib/defaultWidgets";

interface LauncherContextType {
  apps: AppWidgetItem[];
  activeWidgetId: string;
  setActiveWidgetId: (id: string) => void;
  updateApp: (id: string, updated: Partial<AppWidgetItem>) => void;
  updateAppWidget: (
    appId: string,
    widget: { type: WidgetType; title: string; subtitle?: string; value: string; detail?: string }
  ) => void;
  addApp: (app: Omit<AppWidgetItem, "id">) => void;
  deleteApp: (id: string) => void;
  reorderApp: (fromIndex: number, toIndex: number) => void;
  resetDefaults: () => void;
  isCustomizing: boolean;
  setIsCustomizing: (value: boolean) => void;

  // Standalone Widget Engine
  widgets: WidgetInstance[];
  activeWidgetIndex: number;
  setActiveWidgetIndex: (index: number) => void;
  addWidget: (kind: WidgetKind, title?: string) => void;
  updateWidget: (id: string, updated: Partial<WidgetInstance>) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (fromIndex: number, toIndex: number) => void;
  cycleWidget: (direction: "prev" | "next") => void;
  isWidgetModalOpen: boolean;
  setIsWidgetModalOpen: (val: boolean) => void;
  isAppDirectoryOpen: boolean;
  setIsAppDirectoryOpen: (val: boolean) => void;

  // Dumbphone Behavioral Engineering Features
  settings: DumbPhoneSettings;
  setFocusMode: (mode: FocusMode) => void;
  setTextAlignment: (align: TextAlignment) => void;
  setFontSize: (size: AppFontSize) => void;
  setWidgetLayout: (mode: WidgetLayoutMode) => void;
  toggleOledMode: () => void;
  updateSettings: (newSettings: Partial<DumbPhoneSettings>) => void;
  recordAppOpen: () => void;
  pendingMindfulApp: AppWidgetItem | null;
  setPendingMindfulApp: (app: AppWidgetItem | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  mounted: boolean;
}

const APPS_STORAGE_KEY = "ios_launcher_apps_v5";
const SETTINGS_STORAGE_KEY = "ios_launcher_settings_v5";
const WIDGETS_STORAGE_KEY = "ios_launcher_widgets_v1";

const LauncherContext = createContext<LauncherContextType | undefined>(undefined);

export function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppWidgetItem[]>(DEFAULT_APPS);
  const [activeWidgetId, setActiveWidgetId] = useState<string>("clock");
  const [widgets, setWidgets] = useState<WidgetInstance[]>(DEFAULT_WIDGETS);
  const [activeWidgetIndex, setActiveWidgetIndex] = useState<number>(0);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState<boolean>(false);
  const [isAppDirectoryOpen, setIsAppDirectoryOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<DumbPhoneSettings>(DEFAULT_DUMBPHONE_SETTINGS);
  const [pendingMindfulApp, setPendingMindfulApp] = useState<AppWidgetItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    // Tactile haptic feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  // Load from localStorage on client mount with schema sanitization
  useEffect(() => {
    try {
      const savedApps = localStorage.getItem(APPS_STORAGE_KEY) || localStorage.getItem("ios_launcher_apps_v4");
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((app: Partial<AppWidgetItem>) => ({
            id: app.id || `app_${Date.now()}`,
            label: (app.label || "app").toLowerCase().trim(),
            scheme: app.scheme || "tel:",
            description: app.description || "Application",
            category: app.category || "custom",
            enabled: app.enabled !== false,
            mindfulDelay: Boolean(app.mindfulDelay),
            modes:
              Array.isArray(app.modes) && app.modes.length > 0
                ? app.modes
                : (["all", "essential", "focus", "personal"] as FocusMode[]),
            widget: {
              type: app.widget?.type || "telemetry",
              title: app.widget?.title || `${app.label || "app"} widget`,
              subtitle: app.widget?.subtitle || "quick action",
              value: app.widget?.value || "active session",
              detail: app.widget?.detail || app.scheme || "",
            },
          }));
          setApps(sanitized);
        }
      }

      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY) || localStorage.getItem("ios_launcher_settings_v4");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings((prev) => ({
          ...prev,
          ...parsedSettings,
          fontSize: parsedSettings.fontSize || "normal",
          widgetLayout: parsedSettings.widgetLayout || "carousel",
          oledMode: Boolean(parsedSettings.oledMode),
          dailyOpensCount:
            parsedSettings.lastOpensDate === new Date().toISOString().split("T")[0]
              ? parsedSettings.dailyOpensCount || 0
              : 0,
        }));
      }

      const savedWidgets = localStorage.getItem(WIDGETS_STORAGE_KEY);
      if (savedWidgets) {
        const parsedWidgets = JSON.parse(savedWidgets);
        if (Array.isArray(parsedWidgets) && parsedWidgets.length > 0) {
          setWidgets(parsedWidgets);
        }
      }
    } catch (e) {
      console.warn("Failed to load launcher configuration from localStorage:", e);
    }
    setMounted(true);
  }, []);

  // Save apps whenever they change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.warn("Failed to save apps:", e);
    }
  }, [apps, mounted]);

  // Save settings whenever they change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save settings:", e);
    }
  }, [settings, mounted]);

  // Save widgets whenever they change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
    } catch (e) {
      console.warn("Failed to save widgets:", e);
    }
  }, [widgets, mounted]);

  const updateApp = (id: string, updated: Partial<AppWidgetItem>) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updated } : app))
    );
  };

  const updateAppWidget = (
    appId: string,
    widget: { type: WidgetType; title: string; subtitle?: string; value: string; detail?: string }
  ) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, widget } : app))
    );
  };

  const addApp = (newAppData: Omit<AppWidgetItem, "id">) => {
    const id = `app_${Date.now()}`;
    const newApp: AppWidgetItem = {
      ...newAppData,
      id,
    };
    setApps((prev) => [...prev, newApp]);
    setActiveWidgetId(id);
  };

  const deleteApp = (id: string) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
    if (activeWidgetId === id) {
      setActiveWidgetId("clock");
    }
  };

  const reorderApp = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= apps.length || toIndex >= apps.length) {
      return;
    }
    setApps((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  // Widget management functions
  const addWidget = (kind: WidgetKind, customTitle?: string) => {
    const catalogItem = WIDGET_CATALOG.find((c) => c.kind === kind);
    const newWidget: WidgetInstance = {
      id: `w_${Date.now()}`,
      kind,
      title: customTitle || catalogItem?.title || kind,
      subtitle: catalogItem?.description || "",
      enabled: true,
      order: widgets.length,
      config: catalogItem ? { ...catalogItem.defaultConfig } : {},
    };
    setWidgets((prev) => {
      const updated = [...prev, newWidget];
      setActiveWidgetIndex(updated.length - 1);
      return updated;
    });
    showToast(`added ${newWidget.title} to top deck ✓`);
  };

  const updateWidget = (id: string, updated: Partial<WidgetInstance>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated, config: { ...w.config, ...updated.config } } : w))
    );
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setActiveWidgetIndex(0);
  };

  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= widgets.length || toIndex >= widgets.length) {
      return;
    }
    setWidgets((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy.map((w, idx) => ({ ...w, order: idx }));
    });
  };

  const cycleWidget = (direction: "prev" | "next") => {
    const enabledWidgets = widgets.filter((w) => w.enabled);
    if (enabledWidgets.length === 0) return;
    if (direction === "prev") {
      setActiveWidgetIndex((prev) => (prev - 1 + enabledWidgets.length) % enabledWidgets.length);
    } else {
      setActiveWidgetIndex((prev) => (prev + 1) % enabledWidgets.length);
    }
  };

  const resetDefaults = () => {
    setApps(DEFAULT_APPS);
    setWidgets(DEFAULT_WIDGETS);
    setSettings(DEFAULT_DUMBPHONE_SETTINGS);
    setActiveWidgetId("clock");
    setActiveWidgetIndex(0);
    try {
      localStorage.clear();
    } catch {}
  };

  const setFocusMode = (mode: FocusMode) => {
    setSettings((prev) => ({ ...prev, activeMode: mode }));
  };

  const setTextAlignment = (align: TextAlignment) => {
    setSettings((prev) => ({ ...prev, textAlignment: align }));
  };

  const setFontSize = (size: AppFontSize) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const setWidgetLayout = (mode: WidgetLayoutMode) => {
    setSettings((prev) => ({ ...prev, widgetLayout: mode }));
  };

  const toggleOledMode = () => {
    setSettings((prev) => ({ ...prev, oledMode: !prev.oledMode }));
  };

  const updateSettings = (newSettings: Partial<DumbPhoneSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const recordAppOpen = () => {
    const today = new Date().toISOString().split("T")[0];
    setSettings((prev) => {
      const isNewDay = prev.lastOpensDate !== today;
      const count = isNewDay ? 1 : prev.dailyOpensCount + 1;
      return {
        ...prev,
        dailyOpensCount: count,
        lastOpensDate: today,
      };
    });
  };

  return (
    <LauncherContext.Provider
      value={{
        apps,
        activeWidgetId,
        setActiveWidgetId,
        updateApp,
        updateAppWidget,
        addApp,
        deleteApp,
        reorderApp,
        resetDefaults,
        isCustomizing,
        setIsCustomizing,
        widgets,
        activeWidgetIndex,
        setActiveWidgetIndex,
        addWidget,
        updateWidget,
        removeWidget,
        reorderWidgets,
        cycleWidget,
        isWidgetModalOpen,
        setIsWidgetModalOpen,
        isAppDirectoryOpen,
        setIsAppDirectoryOpen,
        settings,
        setFocusMode,
        setTextAlignment,
        setFontSize,
        setWidgetLayout,
        toggleOledMode,
        updateSettings,
        recordAppOpen,
        pendingMindfulApp,
        setPendingMindfulApp,
        isSearchOpen,
        setIsSearchOpen,
        toastMessage,
        showToast,
        mounted,
      }}
    >
      {children}
    </LauncherContext.Provider>
  );
}

export function useLauncher() {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error("useLauncher must be used within a LauncherProvider");
  }
  return context;
}
