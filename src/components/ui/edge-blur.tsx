"use client"

import { useEffect, useState } from "react"

interface EdgeBlurProps {
  position?: "top" | "bottom"
  height?: number
  hideOnFooter?: boolean
}

function EdgeBlur({ position = "bottom", height = 120, hideOnFooter = false }: EdgeBlurProps) {
  const blurLayers = [2, 4, 8, 14, 24]
  const isTop = position === "top"
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!hideOnFooter) return

    const footer = document.querySelector("footer")
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [hideOnFooter])

  if (hideOnFooter && !visible) return null

  return (
    <div
      className={`fixed inset-x-0 isolate z-40 pointer-events-none ${isTop ? "top-0" : "bottom-0"}`}
      style={{ height }}
    >
      {blurLayers.map((blur) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to ${isTop ? "bottom" : "top"}, black, transparent)`,
            WebkitMaskImage: `linear-gradient(to ${isTop ? "bottom" : "top"}, black, transparent)`,
          }}
        />
      ))}
    </div>
  )
}

export function TopBlur({ height = 120 }: { height?: number }) {
  return <EdgeBlur position="top" height={height} />
}

export function BottomBlur({ height = 120, hideOnFooter = false }: { height?: number; hideOnFooter?: boolean }) {
  return <EdgeBlur position="bottom" height={height} hideOnFooter={hideOnFooter} />
}
