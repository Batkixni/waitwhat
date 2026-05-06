"use client"

import { useState } from "react"
import { BorderBeamButton } from "@components/ui/border-beam-button"

interface ServerIpBeamProps {
  serverIp: string
}

function ServerIpBeam({ serverIp }: ServerIpBeamProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serverIp)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <BorderBeamButton
      onClick={copy}
      aria-label="Copy server IP"
      variant="outline"
      theme="dark"
      colorVariant="sunset"
      beamSize="line"
      duration={6}
      strength={0.9}
      brightness={1.15}
      saturation={1.05}
      borderRadius={14}
      className="group min-w-[190px] justify-between rounded-[14px] border-white/[0.08] bg-black/60 px-3.5 py-2.5 text-white shadow-none hover:bg-black/75 hover:text-white dark:border-white/[0.08] dark:bg-black/60 dark:text-white dark:hover:bg-black/75 dark:hover:text-white"
      borderBeamClassName="w-full rounded-[14px]"
    >
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
    </BorderBeamButton>
  )
}

export default ServerIpBeam
