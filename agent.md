# Minecraft Server Website — Agent Guide

## Overview
A pixel-style Minecraft minigame server official website built with **Astro 5**, **Tailwind CSS 4**, and **Bun**.

**Design Philosophy**: Vercel-inspired minimalism × Minecraft pixel aesthetic. Pure black background, generous whitespace, subtle borders, orange accent color.

## Tech Stack
- **Framework**: Astro 5 (SSR, Node standalone adapter)
- **Styling**: Tailwind CSS 4
- **Runtime**: Bun
- **Language**: TypeScript
- **Fonts**: Cubic 11 (via jsDelivr CDN: `@chinese-fonts/cubic`) + monospace fallback

## Quick Start

```bash
cd D:/Programming/waitwhat
bun install
bun run dev        # Dev server
bun run build      # Production build
bun run preview    # Preview build
```

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#000000` | Page background |
| `--color-bg-card` | `#111111` | Card backgrounds |
| `--color-accent` | `#F97316` | Primary accent (orange-500) |
| `--color-accent-light` | `#FB923C` | Hover states |
| `--color-text-primary` | `#FFFFFF` | Headings |
| `--color-text-secondary` | `rgba(255,255,255,0.55)` | Body text |
| `--color-text-tertiary` | `rgba(255,255,255,0.35)` | Captions |
| `--color-border` | `rgba(255,255,255,0.06)` | Borders |
| `--color-border-hover` | `rgba(255,255,255,0.12)` | Hover borders |

### Typography
- **Font**: `Cubic 11` via `https://cdn.jsdelivr.net/npm/@chinese-fonts/cubic@3.0.0/dist/Cubic/result.css`
- **Scale**: xs (10px), sm (12px), base (14px), lg (16px), xl (20px), 2xl (24px), 3xl (30px)

### Components
- **`.card`**: `bg-white/[0.02] border-white/[0.06] rounded-16px`, hover lifts + brightens
- **`.btn-primary`**: Filled orange, black text, hover glow
- **`.btn-ghost`**: Transparent + border, hover bg
- **`.text-gradient`**: White → orange gradient clip

## Project Structure
```
/
├── agent.md
├── package.json
├── astro.config.mjs          # SSR, Node standalone, Tailwind Vite plugin
├── tsconfig.json
├── config/
│   ├── settings.json         # Server config, team, shop, gamemodes, partners
│   └── locales/
│       ├── en.json           # English translations
│       └── zh-tw.json        # Traditional Chinese translations
├── public/
│   └── flags/                # Circular SVG flags (us, tw, eu, jp, kr)
└── src/
    ├── components/
    │   ├── Navbar.astro           # Floating glass nav + language dropdown + Discord
    │   ├── Footer.astro           # 5-section footer
    │   ├── MinecraftText.astro    # §/& color code renderer
    │   ├── ServerStatus.astro     # Live status + copy IP (green/red states)
    │   ├── TeamMember.astro       # mineatar.io face avatar
    │   └── ui/
    │       ├── logo-carousel.tsx  # Animated partner logo carousel (React)
    │       ├── pixel-heading.tsx  # Per-character animated heading (React)
    │       └── edge-blur.tsx      # Bottom edge blur with footer detection (React)
    ├── layouts/
    │   └── MainLayout.astro  # SEO meta + pixel font + grid bg + radial glow
    ├── pages/
    │   ├── index.astro       # Hero (banner + status + CTA) + gamemodes + partners
    │   ├── shop.astro        # Currency switcher + cart drawer + store link
    │   ├── rules.astro       # Dated rule sections from locale
    │   ├── about.astro       # About + timeline milestones + team ranks
    │   └── api/
    │       ├── status.ts     # Mcsrvstat.us proxy (30s cache)
    │       └── i18n.ts       # Locale data endpoint
    ├── styles/
    │   └── global.css        # Design system tokens + animations + utilities
    └── utils/
        ├── config.ts         # Typed settings.json reader
        ├── i18n.ts           # detectLocale, loadLocale, t(), tArray()
        └── mcColor.ts        # Minecraft §/& color + format parser
```

## Key Features

### 1. Localization
- **Detection**: Cookie `lang` → `Accept-Language` header → `config.locale.default` (`en`)
- **Add language**: Create `config/locales/[code].json`, add to `settings.json` `locale.available`, add flag/name in `src/utils/i18n.ts`
- All text in locale files; SEO meta per page per language

### 2. Minecraft Color Codes
- Supports `§` and `\u0026` prefixes
- Colors 0-f, hex (`§x#RRGGBB`), formats (bold `§l`, italic `§o`, underline `§n`, strikethrough `§m`, obfuscated `§k`)
- Newlines via `\n` or literal newline
- Component: `<MinecraftText text="§aHello §cWorld" />`

### 3. Server Status
- `GET /api/status` → queries `api.mcsrvstat.us/3/{ip}:{port}` with 30s server-side cache
- **Dev mode**: Shows red offline state
- **Production**: Green online with player count, red when unreachable
- One-click IP copy with visual feedback

### 4. Shop
- Enable/disable via `settings.json` `shop.enabled`
- Provider: Tebex or MCSets
- Currency switcher (cookie-persisted) with flag icons
- Cart drawer (client-side, ready for headless API)

### 5. Team / About
- Ranks sorted by `priority` in settings
- Empty ranks auto-hidden
- Avatars: `https://api.mineatar.io/face/{UUID}`
- UUID generated deterministically from username string (replace with real UUIDs in production)

## Configuration (`config/settings.json`)

| Key | Description |
|-----|-------------|
| `server.name` | Display name |
| `server.ip` / `server.port` | Minecraft server address |
| `server.banner` | Logo/banner image path |
| `server.discordUrl` | Discord invite link |
| `locale.default` | Default language code |
| `locale.available` | Enabled language codes |
| `shop.enabled` | Toggle shop page |
| `shop.provider` | `tebex` or `mcsets` |
| `shop.tebexUrl` / `shop.mcsetsUrl` | Store URLs |
| `team.ranks` | Rank definitions with `priority` |
| `team.members` | `rank_id → username[]` |
| `gamemodes` | Homepage cards |
| `partners` | Partner links |
| `milestones` | About page timeline |
| `rules.lastUpdated` | Rules page date |

## React UI Components (cult-ui inspired)

### `PixelHeading` (`src/components/ui/pixel-heading.tsx`)
Per-character pixel-font heading with Geist Pixel fonts. Each character displays a different pixel font variant (Square, Grid, Circle, Triangle, Line) with animated cycling on hover or auto-play.

**In Astro (use `text` prop):**
```astro
<PixelHeading
  client:load
  text={config.server.name}
  as="h1"
  mode="wave"           // "uniform" | "multi" | "wave" | "random"
  autoPlay={true}
  staggerDelay={60}
  cycleInterval={200}
  className="text-gradient"
/>
```

**In React (use children):**
```tsx
<PixelHeading mode="wave" autoPlay className="text-6xl text-gradient">
  PixelCraft Network
</PixelHeading>
```

- **Modes**: `uniform` (all chars same font), `multi` (golden-ratio distribution), `wave` (left→right flow), `random` (independent scramble)
- **Gradient preserved**: `text-gradient` class on outer element; each `<span>` char inherits the gradient
- **Astro islands**: Always use the `text` prop instead of children (children don't serialize correctly in Astro islands)

### `BottomBlur` (`src/components/ui/edge-blur.tsx`)
Stacked backdrop-blur layers creating a soft fade at the viewport bottom.

```tsx
<BottomBlur height={80} hideOnFooter={true} />
```

- **hideOnFooter**: Uses `IntersectionObserver` to automatically hide when the footer enters the viewport
- Based on [cult-ui Edge Blur](https://cult-ui.com/docs/components/edge-blur) pattern

### `LogoCarousel` (`src/components/ui/logo-carousel.tsx`)
Multi-column animated logo carousel for the partners section.

```tsx
<LogoCarousel
  logos={[{ id: 1, name: "Partner", img: "/images/logo.png" }]}
  columnCount={3}
/>
```

## Notes
- Cubic 11 font loaded from jsDelivr CDN (`@chinese-fonts/cubic` npm package). For offline use, download woff2 files and update `@import` in `src/styles/global.css`.
- Replace placeholder images in `public/images/` with actual server assets.
- For production UUIDs, change `config/settings.json` `team.members` structure to include real Minecraft UUIDs.
- The `@chinese-fonts/cubic` CDN provides **subsetted fonts** (only needed characters are loaded), which is much faster than loading the full font.
