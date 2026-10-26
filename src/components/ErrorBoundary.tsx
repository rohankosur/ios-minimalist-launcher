"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || "An unexpected error occurred" };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Launcher] Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#050f2d] text-white text-center">
          <div className="max-w-xs p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex flex-col items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-lg font-bold lowercase tracking-tight">launcher recovery</h2>
            <p className="text-xs text-white/60 font-mono lowercase break-all">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {}
                window.location.reload();
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-white text-[#050f2d] font-bold text-xs lowercase active:scale-95 transition-all"
            >
              reset launcher cache
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
