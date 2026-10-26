# iOS Minimalist Text-Based App Launcher (PWA)

A high-performance, single-page Next.js Progressive Web App (PWA) engineered to function as an ultra-minimalist, text-based iOS app launcher with **fully customizable bespoke widgets per app**.

---

## Key Features & Customizability Engine

### 1. Customizable Bespoke Widget For Each App
Every app in the launcher can have its own dedicated widget presentation model in the upper viewport:
- **System Clock**: Precision digital typography, day & date, battery gauge, and celestial telemetry.
- **Quick Scratchpad (`notes`)**: Live editable memo with instant two-way auto-save directly to `localStorage`, plus one-tap deep link to `mobilenotes://`.
- **Speed Contact (`phone`)**: Direct one-tap speed dial card for a favorite contact (`tel:...`).
- **Quick Message (`messages`)**: Instant pre-filled SMS dispatch shortcut (`sms:...`).
- **Now Playing (`spotify`)**: Interactive audio playback telemetry with play/pause state simulation and Spotify URI deep links.
- **Transit Beacon (`google maps`)**: Instant turn-by-turn navigation shortcut with customizable destination address.
- **Device Telemetry (`settings` / `camera`)**: Hardware, optical sensor, and kernel status indicators.
- **Calendar Agenda (`calendar`)**: Upcoming event countdown and agenda sync (`calshow:`).

### 2. Interactive Widget Carousel
- Located in the upper viewport clearance zone.
- Seamlessly swipe or tap the widget selector pills (`clock`, `phone`, `messages`, `notes`, `spotify`, `google maps`, `settings`, etc.) or chevron arrows (`←`, `→`).
- Tapping any app in the lower navigation dock automatically brings that app's widget into focus in the top half!

### 3. Comprehensive "Customize Launcher" Modal Sheet
Accessible via the `⚙ customize widgets` button:
- **Configure Any App**: Edit display label (lowercase), edit iOS URL scheme, reorder app positions (`↑`, `↓`), and delete apps.
- **Customize Widget Parameters**: Change the presentation model, custom title, memo content, contact number, or deep link detail for each app.
- **Curated Preset Library**: One-tap installation for popular apps:
  - `camera` (`camera:`)
  - `calendar` (`calshow:`)
  - `slack` (`slack://`)
  - `discord` (`discord://`)
  - `youtube` (`vnd.youtube://`)
  - `twitter` (`twitter://`)
  - `notion` (`notion://`)
  - `github` (`github://`)
- **Add Custom Apps**: Enter any custom lowercase name and custom URL scheme (`custom://`).
- **PWA Local Storage Persistence**: All custom apps, reordered lists, and tailored widgets are synchronized and stored in `localStorage` (`ios_launcher_apps_v2`), persisting across all standalone PWA sessions without server round-trips.

---

## Visual Materiality & Structural Parameters

- **Optical Glass Stack**: `rgba(5, 15, 45, 0.4)` with `20px backdrop-filter: blur` (`-webkit-backdrop-filter: blur(20px)`).
- **Sheared Borders**: Completely zeroed border geometry (`border: none !important`), eliminating edge diffraction.
- **Starry Space Wallpaper**: Procedural deep space canvas with diffraction spikes, multi-temperature star palettes, dynamic twinkling, and shooting stars.
- **Typographic Load**: Heavy lowercase SF Pro (`-apple-system`, `font-extrabold`) in pure `#ffffff` contrast.
- **Zero-Flash PWA Ignition**: HTML/body and manifest background strictly `#050f2d` with service worker caching.
- **Thumb Zone Ergonomics**: Lower half of viewport anchored for comfortable single-handed reach.

---

## iOS Installation & Local Development

```bash
cd /Users/rohankosur/Documents/GithubProjects/ios-minimalist-launcher
npm run dev # or npm run build && npm run start -p 3030
```

1. Open in mobile Safari on your iPhone.
2. Tap the iOS **Share** icon (`⎋`).
3. Tap **Add to Home Screen**.
4. Open the standalone PWA directly from your Home Screen for a chrome-free, full-screen minimalist text launcher!
