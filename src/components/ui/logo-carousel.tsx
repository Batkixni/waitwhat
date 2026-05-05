"use client"

import React, {
  useCallback,
  useEffect,
  useState,
} from "react"
import { AnimatePresence, motion } from "motion/react"

export interface PartnerLogo {
  name: string
  id: number
  img: string
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const distributeLogos = (allLogos: PartnerLogo[], columnCount: number): PartnerLogo[][] => {
  const shuffled = shuffleArray(allLogos)
  const columns: PartnerLogo[][] = Array.from({ length: columnCount }, () => [])

  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo)
  })

  const maxLength = Math.max(...columns.map((col) => col.length))
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
    }
  })

  return columns
}

interface LogoColumnProps {
  logos: PartnerLogo[]
  index: number
  currentTime: number
}

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime }) => {
    const cycleInterval = 2000
    const columnDelay = index * 200
    const adjustedTime =
      (currentTime + columnDelay) % (cycleInterval * logos.length)
    const currentIndex = Math.floor(adjustedTime / cycleInterval)

    const logo = logos[currentIndex]

    return (
      <motion.div
        className="w-24 h-14 md:w-48 md:h-24 overflow-hidden relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${logo.id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: "-20%",
              opacity: 0,
              filter: "blur(6px)",
              transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.3,
              },
            }}
          >
            <img
              src={logo.img}
              alt={logo.name}
              className="w-20 h-20 md:w-32 md:h-32 max-w-[80%] max-h-[80%] object-contain opacity-60"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }
)

LogoColumn.displayName = "LogoColumn"

interface LogoCarouselProps {
  logos: PartnerLogo[]
  columnCount?: number
}

function LogoCarousel({ logos, columnCount = 3 }: LogoCarouselProps) {
  const [logoSets, setLogoSets] = useState<PartnerLogo[][]>([])
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (logos.length === 0) return
    const distributedLogos = distributeLogos(logos, columnCount)
    setLogoSets(distributedLogos)
  }, [logos, columnCount])

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(updateTime, 100)
    return () => clearInterval(intervalId)
  }, [updateTime])

  if (logoSets.length === 0) return null

  return (
    <div className="flex space-x-4 justify-center">
      {logoSets.map((colLogos, index) => (
        <LogoColumn
          key={index}
          logos={colLogos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  )
}

export { LogoCarousel }
export default LogoCarousel
