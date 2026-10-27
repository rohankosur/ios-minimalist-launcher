"use client";

import Starfield from "@/components/Starfield";
import TopWidgets from "@/components/TopWidgets";
import LauncherNav from "@/components/LauncherNav";
import PWAClientManager from "@/components/PWAClientManager";
import CustomizeModal from "@/components/CustomizeModal";
import MindfulDelayModal from "@/components/MindfulDelayModal";
import AppSearchDrawer from "@/components/AppSearchDrawer";
import { useLauncher } from "@/context/LauncherContext";

export default function LauncherDeck() {
  const { settings } = useLauncher();

  return (
    <main
      className={`fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-between transition-colors duration-300 ${
        settings.oledMode ? "bg-black" : "bg-[#050f2d]"
      }`}
    >
      {/* Cosmic background layers (hidden in OLED true black mode) */}
      {!settings.oledMode && (
        <>
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_0%,#091b42_0%,#050f2d_45%,#02040b_100%)]" />
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_30%,rgba(60,30,110,0.22)_0%,transparent_60%)]" />
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_80%,rgba(15,40,90,0.3)_0%,transparent_50%)]" />
          <div className="fixed inset-0 z-[1] pointer-events-none">
            <Starfield />
          </div>
        </>
      )}

      {/* 
        Layer 10: Main ergonomic viewport frame
        Anchored to physical thumb mechanics
        Responsive vertical rhythm prevents clipping on compact screens
      */}
      <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Upper Half: Top-Mounted Customizable Widgets */}
        <div className="w-full shrink-0 flex flex-col justify-center">
          <TopWidgets />
        </div>

        {/* Lower Half: Anchored down the Y-axis directly into thumb reach */}
        <div className="w-full flex flex-col justify-end pb-safe">
          <PWAClientManager />
          <LauncherNav />
        </div>
      </div>

      {/* Dumb Phone Mindful Friction Delay Modal */}
      <MindfulDelayModal />

      {/* A-Z Intentional App Search Drawer */}
      <AppSearchDrawer />

      {/* Bespoke App & Widget Customizer Sheet Modal */}
      <CustomizeModal />
    </main>
  );
}
