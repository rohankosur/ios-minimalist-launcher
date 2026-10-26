"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppWidgetItem, WidgetType, FocusMode, TextAlignment, DumbPhoneSettings } from "@/types/launcher";
import { DEFAULT_APPS, DEFAULT_DUMBPHONE_SETTINGS } from "@/lib/defaultConfig";

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
  
  // Dumbphone Behavioral Engineering Features
  settings: DumbPhoneSettings;
  setFocusMode: (mode: FocusMode) => void;
  setTextAlignment: (align: TextAlignment) => void;
  updateSettings: (newSettings: Partial<DumbPhoneSettings>) => void;
  recordAppOpen: () => void;
  pendingMindfulApp: AppWidgetItem | null;
  setPendingMindfulApp: (app: AppWidgetItem | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
}

const STORAGE_KEY = "ios_launcher_apps_v3";
const SETTINGS_KEY = "ios_launcher_settings_v3";

const LauncherContext = createContext<LauncherContextType | undefined>(undefined);

export function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppWidgetItem[]>(DEFAULT_APPS);
  const [activeWidgetId, setActiveWidgetId] = useState<string>("clock");
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [settings, setSettings] = useState<DumbPhoneSettings>(DEFAULT_DUMBPHONE_SETTINGS);
  const [pendingMindfulApp, setPendingMindfulApp] = useState<AppWidgetItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedApps = localStorage.getItem(STORAGE_KEY);
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApps(parsed);
        }
      }
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
      const savedWidgetId = localStorage.getItem("ios_launcher_active_widget_v3");
      if (savedWidgetId) {
        setActiveWidgetId(savedWidgetId);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.warn("Failed to save apps:", e);
    }
  }, [apps, mounted]);

  // Save settings whenever they change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save settings:", e);
    }
  }, [settings, mounted]);

  // Save active widget
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("ios_launcher_active_widget_v3", activeWidgetId);
    } catch (e) {
      console.warn("Failed to save active widget id:", e);
    }
  }, [activeWidgetId, mounted]);

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

  const resetDefaults = () => {
    setApps(DEFAULT_APPS);
    setSettings(DEFAULT_DUMBPHONE_SETTINGS);
    setActiveWidgetId("clock");
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem("ios_launcher_active_widget_v3");
    } catch {}
  };

  const setFocusMode = (mode: FocusMode) => {
    setSettings((prev) => ({ ...prev, activeMode: mode }));
  };

  const setTextAlignment = (align: TextAlignment) => {
    setSettings((prev) => ({ ...prev, textAlignment: align }));
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
        settings,
        setFocusMode,
        setTextAlignment,
        updateSettings,
        recordAppOpen,
        pendingMindfulApp,
        setPendingMindfulApp,
        isSearchOpen,
        setIsSearchOpen,
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
