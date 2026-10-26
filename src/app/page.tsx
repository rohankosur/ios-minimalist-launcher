import Starfield from "@/components/Starfield";
import TopWidgets from "@/components/TopWidgets";
import LauncherNav from "@/components/LauncherNav";
import PWAClientManager from "@/components/PWAClientManager";
import CustomizeModal from "@/components/CustomizeModal";
import { LauncherProvider } from "@/context/LauncherContext";

export default function Home() {
  return (
    <LauncherProvider>
      <main className="relative h-[100dvh] w-full overflow-hidden bg-[#050f2d] flex flex-col items-center justify-between">
        {/* Layer 0: Deep space celestial nebula & void base */}
        <div 
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_0%,#091b42_0%,#050f2d_45%,#02040b_100%)]" 
        />
        <div 
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_30%,rgba(60,30,110,0.22)_0%,transparent_60%)]" 
        />
        <div 
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_80%,rgba(15,40,90,0.3)_0%,transparent_50%)]" 
        />

        {/* Layer 1: Starry space wallpaper canvas */}
        <div className="fixed inset-0 z-[1] pointer-events-none">
          <Starfield />
        </div>

        {/* 
          Layer 10: Main ergonomic viewport frame
          Anchored to modern thumb mechanics on mobile screens
        */}
        <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-between overflow-hidden">
          {/* Upper Half: Top-Mounted Customizable Widgets (Clock, Notes, Speed Dial, Media, Maps) */}
          <div className="w-full flex-1 flex flex-col justify-center">
            <TopWidgets />
          </div>

          {/* Lower Half: Anchored down the Y-axis directly into thumb reach */}
          <div className="w-full flex flex-col justify-end pb-safe">
            <PWAClientManager />
            <LauncherNav />
          </div>
        </div>

        {/* Bespoke App & Widget Customizer Sheet Modal */}
        <CustomizeModal />
      </main>
    </LauncherProvider>
  );
}
