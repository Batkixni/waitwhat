"use client"

import { useEffect, useState } from "react"
import { BorderBeamButton } from "@components/ui/border-beam-button"

interface ServerStatusBeamProps {
  serverIp: string
  offlineLabel: string
  onlineLabel: string
  playersLabel: string
  initialOffline?: boolean
}

function ServerStatusBeam({
  serverIp,
  offlineLabel,
  playersLabel,
  initialOffline = true,
}: ServerStatusBeamProps) {
  const [copied, setCopied] = useState(false)
  const [online, setOnline] = useState(!initialOffline)
  const [playerCount, setPlayerCount] = useState<number | null>(null)
  const [version, setVersion] = useState("")

  useEffect(() => {
    let mounted = true

    const update = async () => {
      try {
        const res = await fetch("/api/status")
        const data = await res.json()
        if (!mounted) return

        if (data.online) {
          setOnline(true)
          setPlayerCount(data.players?.online ?? 0)
          setVersion(data.version || "")
        } else {
          setOnline(false)
          setPlayerCount(null)
          setVersion("")
        }
      } catch {
        if (!mounted) return
        setOnline(false)
        setPlayerCount(null)
        setVersion("")
      }
    }

    update()
    const timer = window.setInterval(update, 30000)
    return () => {
      mounted = false
      window.clearInterval(timer)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serverIp)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  const displayIp = serverIp.replace(/^play\./, "")
  const statusText = online
    ? `${playerCount ?? 0} ${playersLabel}${version ? ` (${version})` : ""}`
    : offlineLabel

  return (
    <BorderBeamButton
      type="button"
      onClick={copy}
      aria-label="Copy server IP"
      variant="outline"
      theme="dark"
      staticColors={["#F7EE13", "#FFE85A", "#F7EE13"]}
      beamSize="md"
      duration={5}
      strength={0.95}
      brightness={1.25}
      saturation={1.1}
      borderRadius={6}
      borderBeamClassName="w-full rounded-md"
      className="group inline-flex h-auto min-w-[300px] max-w-full items-center gap-3 rounded-md border-white/[0.08] bg-black/45 px-4 py-3 text-left text-white shadow-[0_14px_42px_rgba(0,0,0,0.38)] backdrop-blur-md transition-all hover:border-[#F7EE13]/35 hover:bg-black/60 hover:text-white dark:border-white/[0.08] dark:bg-black/45 dark:text-white dark:hover:bg-black/60 sm:min-w-[360px]"
    >
      <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
        {online ? (
          <>
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#22C55E]/35" />
            <span className="absolute h-5 w-5 rounded-full bg-[#22C55E]/35 blur-md" />
          </>
        ) : null}
        <span className={`relative h-2.5 w-2.5 rounded-full ${online ? "bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.95)]" : "bg-red-500"}`} />
      </span>

      <span className="min-w-0 flex-1 font-pixel text-sm leading-none tracking-wide text-white/90 sm:text-base">
        <span className="text-white">{displayIp}</span>
        <span className="text-white/85"> - </span>
        <span className={online ? "text-white" : "text-white/65"}>{statusText}</span>
      </span>

      <span className="shrink-0 text-white/45 transition-colors group-hover:text-white/80">
        {copied ? (
          <svg className="h-4 w-4 text-[#F7EE13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </BorderBeamButton>
  )
}

export default ServerStatusBeam
