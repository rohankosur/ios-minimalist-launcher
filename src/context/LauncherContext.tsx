"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppWidgetItem, WidgetType } from "@/types/launcher";
import { DEFAULT_APPS } from "@/lib/defaultConfig";

interface LauncherContextType {
  apps: AppWidgetItem[];
  activeWidgetId: string; // "clock" or any app.id
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
}

const STORAGE_KEY = "ios_launcher_apps_v2";

const LauncherContext = createContext<LauncherContextType | undefined>(undefined);

export function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppWidgetItem[]>(DEFAULT_APPS);
  const [activeWidgetId, setActiveWidgetId] = useState<string>("clock");
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApps(parsed);
        }
      }
      const savedWidgetId = localStorage.getItem("ios_launcher_active_widget_v2");
      if (savedWidgetId) {
        setActiveWidgetId(savedWidgetId);
      }
    } catch (e) {
      console.warn("Failed to load launcher configuration from localStorage:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever apps change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.warn("Failed to save launcher configuration to localStorage:", e);
    }
  }, [apps, mounted]);

  // Save active widget selection
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("ios_launcher_active_widget_v2", activeWidgetId);
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
    setActiveWidgetId("clock");
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("ios_launcher_active_widget_v2");
    } catch {}
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
