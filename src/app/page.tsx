import LauncherDeck from "@/components/LauncherDeck";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LauncherProvider } from "@/context/LauncherContext";

export default function Home() {
  return (
    <ErrorBoundary>
      <LauncherProvider>
        <LauncherDeck />
      </LauncherProvider>
    </ErrorBoundary>
  );
}
