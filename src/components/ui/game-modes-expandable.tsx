"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

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

function useWindowWidth() {
  const [width, setWidth] = useState<number>(1024)

  useEffect(() => {
    setWidth(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
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
  const width = useWindowWidth()
  const isMobile = width < 1024

  if (!modes.length) return null

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-center">
      {modes.map((mode) => {
        const isExpanded = mode.id === activeId
        const emoji = emojiByMode[mode.id] ?? "🎮"

        return (
          <div key={mode.id} className="w-full lg:w-auto">
            {/* Mobile */}
            <div className="lg:hidden w-full">
              <button
                type="button"
                onClick={() => setActiveId(mode.id)}
                className={`w-full rounded-sm border p-2 cursor-pointer text-left transition-colors duration-200 ${
                  isExpanded
                    ? "border-[#F7EE13]/20 bg-white/[0.02]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className={`rounded-sm border p-4 ${
                  isExpanded
                    ? "border-[#F7EE13]/20 bg-[#0F0A07]"
                    : "border-white/[0.06] bg-[#0B0B0B]"
                }`}>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-sm border text-2xl ${
                      isExpanded
                        ? "border-[#F7EE13]/25 bg-[#F7EE13]/10"
                        : "border-white/[0.08] bg-white/[0.03]"
                    }`}>
                      {emoji}
                    </div>
                    <span className={`rounded-sm border px-3 py-1.5 font-pixel text-[10px] ${
                      isExpanded
                        ? "border-[#F7EE13]/12 bg-[#F7EE13]/8 text-[#F7EE13]/75"
                        : "border-white/[0.08] bg-white/[0.03] text-white/35"
                    }`}>
                      {comingSoonLabel}
                    </span>
                  </div>

                  <div className="text-center">
                    <h3 className="font-pixel text-xl text-white/90">{mode.name}</h3>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 font-pixel text-xs leading-relaxed text-white/50">
                            {mode.description}
                          </p>

                          <div className="mt-6 grid grid-cols-1 gap-3">
                            <div className="rounded-sm border border-white/[0.06] bg-black/20 p-4 text-center">
                              <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{modeLabel}</div>
                              <div className="font-pixel text-xs text-white/80">{mode.name}</div>
                            </div>
                            <div className="rounded-sm border border-white/[0.06] bg-black/20 p-4 text-center">
                              <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{statusLabel}</div>
                              <div className="font-pixel text-xs text-[#F7EE13]/80">{comingSoonLabel}</div>
                            </div>
                            <div className="rounded-sm border border-white/[0.06] bg-black/20 p-4 text-center">
                              <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{focusLabel}</div>
                              <div className="font-pixel text-xs text-white/80">{focusValue}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block">
              <DesktopCard
                mode={mode}
                isExpanded={isExpanded}
                emoji={emoji}
                onToggle={() => setActiveId(mode.id)}
                comingSoonLabel={comingSoonLabel}
                modeLabel={modeLabel}
                statusLabel={statusLabel}
                focusLabel={focusLabel}
                focusValue={focusValue}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "@components/ui/expandable"

function DesktopCard({
  mode,
  isExpanded,
  emoji,
  onToggle,
  comingSoonLabel,
  modeLabel,
  statusLabel,
  focusLabel,
  focusValue,
}: {
  mode: ExpandableGameMode
  isExpanded: boolean
  emoji: string
  onToggle: () => void
  comingSoonLabel: string
  modeLabel: string
  statusLabel: string
  focusLabel: string
  focusValue: string
}) {
  return (
    <Expandable
      expanded={isExpanded}
      onToggle={onToggle}
      expandDirection="horizontal"
      transitionDuration={0.28}
      className="w-full lg:w-auto"
    >
      <ExpandableCard
        collapsedSize={{ width: 220, height: 360 }}
        expandedSize={{ width: 720, height: 360 }}
        className="w-full lg:max-w-none"
      >
        <div className="grid h-full grid-cols-1 rounded-sm border border-white/[0.06] bg-white/[0.02] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className={`relative flex h-full flex-col overflow-hidden rounded-sm border ${
            isExpanded
              ? "border-[#F7EE13]/20 bg-[#0F0A07]"
              : "border-white/[0.06] bg-[#0B0B0B]"
          }`}>
            <div className={`pointer-events-none absolute inset-0 ${
              isExpanded
                ? "bg-[radial-gradient(circle_at_top,rgba(247,238,19,0.2),transparent_58%)]"
                : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_52%)]"
            }`} />

            <ExpandableTrigger className="relative h-full outline-none">
              <div className="flex h-full flex-col justify-between">
                <ExpandableCardHeader className="pb-4">
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-sm border text-2xl ${
                      isExpanded
                        ? "border-[#F7EE13]/25 bg-[#F7EE13]/10"
                        : "border-white/[0.08] bg-white/[0.03]"
                    }`}>
                      {emoji}
                    </div>

                    <span className={`rounded-sm border px-3 py-1.5 font-pixel text-[10px] ${
                      isExpanded
                        ? "border-[#F7EE13]/12 bg-[#F7EE13]/8 text-[#F7EE13]/75"
                        : "border-white/[0.08] bg-white/[0.03] text-white/35"
                    }`}>
                      {comingSoonLabel}
                    </span>
                  </div>
                </ExpandableCardHeader>

                <ExpandableCardContent className="flex flex-1 flex-col justify-end px-6 pb-6 pt-2">
                  {isExpanded ? (
                    <h3 className="font-pixel text-xl leading-[1.1] text-white/90 sm:text-2xl">
                      {mode.name}
                    </h3>
                  ) : (
                    <h3 className="font-pixel text-base leading-[1.15] text-white/80 transition-colors duration-200">
                      {mode.name}
                    </h3>
                  )}

                  {!isExpanded && (
                    <p className="mt-3 line-clamp-3 font-pixel text-[10px] leading-relaxed text-white/30">
                      {mode.description}
                    </p>
                  )}

                  <ExpandableContent preset="slide-up" className="mt-4" transition={{ duration: 0.18 }}>
                    <p className="max-w-lg font-pixel text-xs leading-relaxed text-white/50 sm:text-sm">
                      {mode.description}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-sm border border-white/[0.06] bg-black/20 p-4 text-center">
                        <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{modeLabel}</div>
                        <div className="font-pixel text-xs text-white/80">{mode.name}</div>
                      </div>
                      <div className="rounded-sm border border-white/[0.06] bg-black/20 p-4 text-center">
                        <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{statusLabel}</div>
                        <div className="font-pixel text-xs text-[#F7EE13]/80">{comingSoonLabel}</div>
                      </div>
                      <div className="rounded-sm border border-white/[0.06] bg-black/20 p-4 text-center">
                        <div className="mb-2 font-pixel text-[9px] uppercase tracking-[0.18em] text-white/25">{focusLabel}</div>
                        <div className="font-pixel text-xs text-white/80">{focusValue}</div>
                      </div>
                    </div>
                  </ExpandableContent>
                </ExpandableCardContent>
              </div>
            </ExpandableTrigger>
          </div>
        </div>
      </ExpandableCard>
    </Expandable>
  )
}

export default GameModesExpandable
export { GameModesExpandable }
