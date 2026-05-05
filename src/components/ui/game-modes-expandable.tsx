"use client"

import React, { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

export interface ExpandableGameMode {
  id: string
  name: string
  description: string
  icon?: string
}

interface GameModesExpandableProps {
  modes: ExpandableGameMode[]
  comingSoonLabel: string
  modeLabel: string
  statusLabel: string
  focusLabel: string
  focusValue: string
}

const emojiByMode: Record<string, string> = {
  bedwars: "🛏",
  skywars: "☁",
  duels: "⚔",
}

function GameModesExpandable({
  modes,
  comingSoonLabel,
  modeLabel,
  statusLabel,
  focusLabel,
  focusValue,
}: GameModesExpandableProps) {
  const [activeId, setActiveId] = useState<string>(modes[0]?.id ?? "")

  const activeMode = useMemo(
    () => modes.find((mode) => mode.id === activeId) ?? modes[0],
    [activeId, modes]
  )

  if (!modes.length || !activeMode) return null

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
      <div className="flex flex-col gap-3">
        {modes.map((mode) => {
          const isActive = mode.id === activeId

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveId(mode.id)}
              className={`w-full rounded-2xl border text-left transition-all duration-300 ${
                isActive
                  ? "border-[#F97316]/30 bg-[#F97316]/[0.08] shadow-[0_0_0_1px_rgba(249,115,22,0.06)]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
              }`}
              aria-pressed={isActive}
            >
              <div className="flex items-center gap-4 p-4 sm:p-5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl ${
                  isActive
                    ? "border-[#F97316]/30 bg-[#F97316]/10"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}>
                  {emojiByMode[mode.id] ?? "🎮"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h3 className="font-pixel text-sm text-white/90">{mode.name}</h3>
                    <span className="rounded-md border border-[#F97316]/10 bg-[#F97316]/5 px-2 py-0.5 font-pixel text-[9px] text-[#F97316]/70">
                      {comingSoonLabel}
                    </span>
                  </div>
                  <p className="font-pixel text-[10px] leading-relaxed text-white/35">
                    {mode.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-7 min-h-[320px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),transparent_55%)]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode.id}
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative z-10 flex h-full flex-col"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F97316]/20 bg-[#F97316]/10 text-2xl">
                  {emojiByMode[activeMode.id] ?? "🎮"}
                </div>
                <h3 className="font-pixel text-xl text-white/90 sm:text-2xl">{activeMode.name}</h3>
              </div>

              <span className="rounded-lg border border-[#F97316]/10 bg-[#F97316]/5 px-3 py-1.5 font-pixel text-[10px] text-[#F97316]/75">
                {comingSoonLabel}
              </span>
            </div>

            <p className="max-w-lg font-pixel text-xs leading-relaxed text-white/50 sm:text-sm">
              {activeMode.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{modeLabel}</div>
                <div className="font-pixel text-xs text-white/80">{activeMode.name}</div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{statusLabel}</div>
                <div className="font-pixel text-xs text-[#F97316]/80">{comingSoonLabel}</div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{focusLabel}</div>
                <div className="font-pixel text-xs text-white/80">{focusValue}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GameModesExpandable
export { GameModesExpandable }
