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
  onlineLabel,
  playersLabel,
  initialOffline = true,
}: ServerStatusBeamProps) {
  const [copied, setCopied] = useState(false)
  const [online, setOnline] = useState(!initialOffline)
  const [playerText, setPlayerText] = useState("")

  useEffect(() => {
    let mounted = true

    const update = async () => {
      try {
        const res = await fetch("/api/status")
        const data = await res.json()
        if (!mounted) return

        if (data.online) {
          setOnline(true)
          setPlayerText(`${data.players?.online || 0} / ${data.players?.max || 0} ${playersLabel}`)
        } else {
          setOnline(false)
          setPlayerText("")
        }
      } catch {
        if (!mounted) return
        setOnline(false)
        setPlayerText("")
      }
    }

    update()
    const timer = window.setInterval(update, 30000)
    return () => {
      mounted = false
      window.clearInterval(timer)
    }
  }, [playersLabel])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serverIp)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  const statusColor = online ? "#22C55E" : "#ef4444"

  return (
    <BorderBeamButton
      type="button"
      onClick={copy}
      aria-label="Copy server IP"
      variant="outline"
      theme="dark"
      colorVariant={online ? "colorful" : "sunset"}
      beamSize="md"
      duration={6}
      strength={0.9}
      brightness={1.1}
      saturation={1.05}
      borderRadius={4}
      borderBeamClassName="w-full rounded-sm"
      className="group inline-flex h-auto w-full min-w-0 sm:min-w-[320px] items-center justify-between gap-3 rounded-sm border-white/[0.08] bg-black/55 px-4 py-3 text-white shadow-none hover:bg-black/70 hover:text-white dark:border-white/[0.08] dark:bg-black/55 dark:text-white dark:hover:bg-black/70 dark:hover:text-white"
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-2 w-2 rounded-full transition-colors duration-500" style={{ backgroundColor: statusColor }} />
          <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-20" style={{ backgroundColor: statusColor }} />
        </div>

        <div className="flex flex-col items-start text-left">
          <span className="font-pixel text-[10px] transition-colors duration-500" style={{ color: online ? 'rgba(34,197,94,.75)' : 'rgba(248,113,113,.72)' }}>
            {online ? onlineLabel : offlineLabel}
          </span>
          {playerText ? (
            <span className="font-pixel text-[10px] text-white/50">{playerText}</span>
          ) : null}
        </div>
      </div>

      <div className="h-6 w-px bg-white/8" />

      <div className="flex items-center gap-2">
        <span className="font-pixel text-xs tracking-wider text-white/75">{serverIp}</span>
        {copied ? (
          <svg className="h-3.5 w-3.5 shrink-0 text-[#F7EE13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 shrink-0 text-white/30 transition-colors group-hover:text-white/65" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        )}
      </div>
    </BorderBeamButton>
  )
}

export default ServerStatusBeam
