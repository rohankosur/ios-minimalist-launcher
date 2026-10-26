import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050f2d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "launcher",
  description: "Minimalist text-based iOS app launcher",
  applicationName: "launcher",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "launcher",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full overflow-hidden select-none" style={{ backgroundColor: "#050f2d" }}>
      <head>
        {/* Immediate anti-flash stylesheet to eliminate thermal white-flash on ignition */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #050f2d !important;
                color: #ffffff !important;
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                overflow: hidden;
                overscroll-behavior: none;
                -webkit-overscroll-behavior: none;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
              }
            `,
          }}
        />
      </head>
      <body className="h-full w-full overflow-hidden bg-[#050f2d] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
