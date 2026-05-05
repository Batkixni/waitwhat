"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/* ─── Constants ─── */

const PIXEL_FONTS = [
  "font-geist-pixel-square",
  "font-geist-pixel-grid",
  "font-geist-pixel-circle",
  "font-geist-pixel-triangle",
  "font-geist-pixel-line",
] as const

const FONT_LABELS = ["Square", "Grid", "Circle", "Triangle", "Line"] as const
const FONT_COUNT = PIXEL_FONTS.length

const PREFIX_FONT_MAP: Record<string, string> = {
  square: "font-geist-pixel-square",
  grid: "font-geist-pixel-grid",
  circle: "font-geist-pixel-circle",
  triangle: "font-geist-pixel-triangle",
  line: "font-geist-pixel-line",
}

const ISOLATE_FONT_MAP: Record<string, string> = {
  sans: "font-sans",
  mono: "font-mono",
}

function resolveIsolateFont(value: string): string {
  return ISOLATE_FONT_MAP[value] ?? value
}

const PHI = (1 + Math.sqrt(5)) / 2
const TICK_MS = 50

/* ─── Distribution algorithms ─── */

function goldenBase(index: number): number {
  return Math.floor((index * PHI * FONT_COUNT) % FONT_COUNT)
}

function pseudoRandom(tick: number, index: number): number {
  return ((tick * 2654435761 + index * 340573321) >>> 0) % FONT_COUNT
}

/* ─── Helpers ─── */

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractText).join("")
  if (
    children !== null &&
    children !== undefined &&
    typeof children === "object" &&
    "props" in children
  ) {
    return extractText(
      (children as React.ReactElement<{ children?: React.ReactNode }>).props
        .children
    )
  }
  return ""
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

/* ─── Types ─── */

export type PixelHeadingMode = "uniform" | "multi" | "wave" | "random"

export interface PixelHeadingProps extends React.ComponentProps<"h1"> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  /** Static text string. Use this instead of children in Astro islands. */
  text?: string
  cycleInterval?: number
  defaultFontIndex?: number
  onFontIndexChange?: (index: number) => void
  showLabel?: boolean
  mode?: PixelHeadingMode
  staggerDelay?: number
  autoPlay?: boolean
  prefix?: string
  prefixFont?: "square" | "grid" | "circle" | "triangle" | "line" | "none"
  isolate?: Record<string, string>
}

/* ─── Component ─── */

export function PixelHeading({
  children,
  text: textProp,
  as: Tag = "h1",
  className,
  cycleInterval = 400,
  defaultFontIndex = 0,
  onFontIndexChange,
  showLabel = false,
  mode = "multi",
  staggerDelay = 120,
  autoPlay = false,
  prefix,
  prefixFont = "none",
  isolate,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: PixelHeadingProps) {
  const text = useMemo(
    () => textProp ?? extractText(children),
    [textProp, children]
  )

  const [msElapsed, setMsElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevUniformIndex = useRef(defaultFontIndex)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (!autoPlay) return
    setIsActive(true)
    setMsElapsed(0)
    intervalRef.current = setInterval(() => {
      setMsElapsed((prev) => prev + TICK_MS)
    }, TICK_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoPlay])

  const charFonts = useMemo(() => {
    const fonts: number[] = []
    let vi = 0

    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        fonts.push(-1)
        continue
      }

      switch (mode) {
        case "uniform": {
          const cycles = Math.floor(msElapsed / cycleInterval)
          const idx = (defaultFontIndex + cycles) % FONT_COUNT
          fonts.push(idx)
          break
        }
        case "multi": {
          const base = goldenBase(vi)
          const charMs = Math.max(0, msElapsed - vi * staggerDelay)
          const cycles = Math.floor(charMs / cycleInterval)
          fonts.push((base + cycles) % FONT_COUNT)
          break
        }
        case "wave": {
          const charMs = Math.max(0, msElapsed - vi * staggerDelay)
          const cycles = Math.floor(charMs / cycleInterval)
          fonts.push((vi + cycles) % FONT_COUNT)
          break
        }
        case "random": {
          const charMs = Math.max(0, msElapsed - vi * staggerDelay)
          const cycles = Math.floor(charMs / cycleInterval)
          fonts.push(cycles > 0 ? pseudoRandom(cycles, vi) : goldenBase(vi))
          break
        }
      }
      vi++
    }
    return fonts
  }, [text, mode, msElapsed, cycleInterval, staggerDelay, defaultFontIndex])

  useEffect(() => {
    if (mode !== "uniform") return
    const idx = charFonts.find((f) => f !== -1) ?? defaultFontIndex
    if (idx !== prevUniformIndex.current) {
      prevUniformIndex.current = idx
      onFontIndexChange?.(idx)
    }
  }, [charFonts, mode, defaultFontIndex, onFontIndexChange])

  const activeLabel = useMemo(() => {
    if (mode === "uniform") {
      const idx = charFonts.find((f) => f !== -1) ?? 0
      return FONT_LABELS[idx]
    }
    const modeLabels: Record<PixelHeadingMode, string> = {
      uniform: "",
      multi: "Multi",
      wave: "Wave",
      random: "Random",
    }
    return modeLabels[mode]
  }, [mode, charFonts])

  const startCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsActive(true)
    setMsElapsed(0)
    intervalRef.current = setInterval(() => {
      setMsElapsed((prev) => prev + TICK_MS)
    }, TICK_MS)
  }, [])

  const stopCycling = useCallback(() => {
    if (autoPlay) {
      setIsActive(true)
      return
    }
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [autoPlay])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLHeadingElement>) => {
      startCycling()
      onMouseEnter?.(e)
    },
    [startCycling, onMouseEnter]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLHeadingElement>) => {
      stopCycling()
      onMouseLeave?.(e)
    },
    [stopCycling, onMouseLeave]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      startCycling()
      onFocus?.(e)
    },
    [startCycling, onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      stopCycling()
      onBlur?.(e)
    },
    [stopCycling, onBlur]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLHeadingElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setMsElapsed((prev) => prev + cycleInterval)
      }
      onKeyDown?.(e)
    },
    [cycleInterval, onKeyDown]
  )

  const uniformIdx =
    mode === "uniform"
      ? (charFonts.find((f) => f !== -1) ?? defaultFontIndex)
      : 0

  return (
    <div
      data-slot="pixel-heading"
      className="inline-flex flex-col items-start gap-2"
    >
      <Tag
        data-state={isActive ? "active" : "idle"}
        data-mode={mode}
        aria-label={prefix ? `${prefix} ${text}` : text}
        tabIndex={0}
        className={cn(
          "cursor-default select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          mode === "uniform" && PIXEL_FONTS[uniformIdx],
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {prefix && (
          <>
            {isolate ? (
              prefix.split("").map((char, i) => (
                <span
                  key={`p${i}`}
                  className={cn(
                    prefixFont !== "none"
                      ? PREFIX_FONT_MAP[prefixFont]
                      : undefined,
                    isolate[char]
                      ? resolveIsolateFont(isolate[char])
                      : undefined
                  )}
                  aria-hidden
                >
                  {char}
                </span>
              ))
            ) : (
              <span
                className={
                  prefixFont !== "none"
                    ? PREFIX_FONT_MAP[prefixFont]
                    : undefined
                }
                aria-hidden
              >
                {prefix}
              </span>
            )}
            <span> </span>
          </>
        )}

        {mode === "uniform"
          ? children
          : text.split("").map((char, i) =>
              char === " " ? (
                <span key={i}> </span>
              ) : isolate?.[char] ? (
                <span
                  key={i}
                  className={resolveIsolateFont(isolate[char])}
                  aria-hidden
                >
                  {char}
                </span>
              ) : (
                <span
                  key={i}
                  className={PIXEL_FONTS[charFonts[i]]}
                  aria-hidden
                >
                  {char}
                </span>
              )
            )}
      </Tag>
      {showLabel && (
        <output
          data-slot="pixel-heading-label"
          aria-live="polite"
          className={cn(
            "text-xs uppercase tracking-widest text-white/40 transition-opacity duration-200",
            isActive || autoPlay ? "opacity-100" : "opacity-0"
          )}
        >
          {activeLabel}
        </output>
      )}
    </div>
  )
}

export default PixelHeading
