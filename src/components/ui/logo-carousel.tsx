"use client"

export interface PartnerLogo {
  name: string
  id: number
  img: string
  url?: string
}

interface LogoCarouselProps {
  logos: PartnerLogo[]
  columnCount?: number
}

function LogoCarousel({ logos }: LogoCarouselProps) {
  if (logos.length === 0) return null

  const marqueeLogos = [...logos, ...logos]

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-partner-marquee items-center gap-10 will-change-transform">
        {marqueeLogos.map((logo, index) => {
          const content = (
            <img
              src={logo.img}
              alt={logo.name}
              className="h-14 w-auto max-w-[180px] object-contain opacity-80 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 sm:h-16"
              loading="lazy"
            />
          )

          return logo.url ? (
            <a
              key={`${logo.id}-${index}`}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-20 min-w-[160px] shrink-0 items-center justify-center"
              aria-label={logo.name}
            >
              {content}
            </a>
          ) : (
            <div
              key={`${logo.id}-${index}`}
              className="flex h-20 min-w-[160px] shrink-0 items-center justify-center"
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { LogoCarousel }
export default LogoCarousel
