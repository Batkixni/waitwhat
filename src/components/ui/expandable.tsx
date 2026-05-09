"use client"

import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  type TargetAndTransition,
  useMotionValue,
  useSpring,
} from "motion/react"
import useMeasure from "react-use-measure"

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

const springConfig = { stiffness: 200, damping: 20, bounce: 0.2 }

interface ExpandableContextType {
  isExpanded: boolean
  toggleExpand: () => void
  expandDirection: "vertical" | "horizontal" | "both"
  expandBehavior: "replace" | "push"
  transitionDuration: number
  easeType:
    | "easeInOut"
    | "easeIn"
    | "easeOut"
    | "linear"
    | [number, number, number, number]
  initialDelay: number
  onExpandEnd?: () => void
  onCollapseEnd?: () => void
}

const ExpandableContext = createContext<ExpandableContextType>({
  isExpanded: false,
  toggleExpand: () => {},
  expandDirection: "vertical",
  expandBehavior: "replace",
  transitionDuration: 0.3,
  easeType: "easeInOut",
  initialDelay: 0,
})

const useExpandable = () => useContext(ExpandableContext)

type ExpandablePropsBase = Omit<HTMLMotionProps<"div">, "children">

interface ExpandableProps extends ExpandablePropsBase {
  children: ReactNode | ((props: { isExpanded: boolean }) => ReactNode)
  expanded?: boolean
  onToggle?: () => void
  transitionDuration?: number
  easeType?:
    | "easeInOut"
    | "easeIn"
    | "easeOut"
    | "linear"
    | [number, number, number, number]
  expandDirection?: "vertical" | "horizontal" | "both"
  expandBehavior?: "replace" | "push"
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
}

const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      children,
      expanded,
      onToggle,
      transitionDuration = 0.3,
      easeType = "easeInOut",
      expandDirection = "vertical",
      expandBehavior = "replace",
      initialDelay = 0,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      ...props
    },
    ref
  ) => {
    const [isExpandedInternal, setIsExpandedInternal] = useState(false)
    const isExpanded = expanded !== undefined ? expanded : isExpandedInternal
    const toggleExpand = onToggle || (() => setIsExpandedInternal((prev) => !prev))

    useEffect(() => {
      if (isExpanded) onExpandStart?.()
      else onCollapseStart?.()
    }, [isExpanded, onExpandStart, onCollapseStart])

    return (
      <ExpandableContext.Provider
        value={{
          isExpanded,
          toggleExpand,
          expandDirection,
          expandBehavior,
          transitionDuration,
          easeType,
          initialDelay,
          onExpandEnd,
          onCollapseEnd,
        }}
      >
        <motion.div
          ref={ref}
          initial={false}
          transition={{ duration: transitionDuration, ease: easeType, delay: initialDelay }}
          {...props}
        >
          {typeof children === "function" ? children({ isExpanded }) : children}
        </motion.div>
      </ExpandableContext.Provider>
    )
  }
)
Expandable.displayName = "Expandable"

type AnimationPreset = {
  initial: Record<string, string | number>
  animate: Record<string, string | number>
  exit: Record<string, string | number>
}

const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  "blur-md": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
}

interface AnimationProps {
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  exit?: TargetAndTransition
}

const getAnimationProps = (
  preset: keyof typeof ANIMATION_PRESETS | undefined,
  animateOut?: AnimationProps
) => {
  const presetAnimation = preset
    ? ANIMATION_PRESETS[preset]
    : { initial: {}, animate: {}, exit: {} }

  return {
    initial: presetAnimation.initial,
    animate: presetAnimation.animate,
    exit: animateOut?.exit || presetAnimation.exit,
  }
}

const ExpandableContent = React.forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<"div">, "ref"> & {
    preset?: keyof typeof ANIMATION_PRESETS
    animateOut?: AnimationProps
    stagger?: boolean
    staggerChildren?: number
    keepMounted?: boolean
  }
>(
  (
    { children, preset, animateOut, stagger = false, staggerChildren = 0.1, keepMounted = false, ...props },
    ref
  ) => {
    const { isExpanded, transitionDuration, easeType } = useExpandable()
    const [measureRef, { height: measuredHeight }] = useMeasure()
    const animatedHeight = useMotionValue(0)
    const smoothHeight = useSpring(animatedHeight, springConfig)

    useEffect(() => {
      animatedHeight.set(isExpanded ? measuredHeight : 0)
    }, [isExpanded, measuredHeight, animatedHeight])

    const animationProps = getAnimationProps(preset, animateOut)

    return (
      <motion.div
        ref={ref}
        style={{ height: smoothHeight, overflow: "hidden" }}
        transition={{ duration: transitionDuration, ease: easeType }}
        {...props}
      >
        <AnimatePresence initial={false}>
          {(isExpanded || keepMounted) && (
            <motion.div
              ref={measureRef}
              initial={animationProps.initial}
              animate={animationProps.animate}
              exit={animationProps.exit}
              transition={{ duration: transitionDuration, ease: easeType }}
            >
              {stagger ? (
                <motion.div
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren } },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {React.Children.map(children as React.ReactNode, (child, index) => (
                    <motion.div
                      key={index}
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                      {child}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                children
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)
ExpandableContent.displayName = "ExpandableContent"

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  collapsedSize?: { width?: number; height?: number }
  expandedSize?: { width?: number; height?: number }
  hoverToExpand?: boolean
  expandDelay?: number
  collapseDelay?: number
}

const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  (
    {
      children,
      className = "",
      collapsedSize = { width: 320, height: 211 },
      expandedSize = { width: 480, height: undefined },
      hoverToExpand = false,
      expandDelay = 0,
      collapseDelay = 0,
      ...props
    },
    ref
  ) => {
    const { isExpanded, toggleExpand, expandDirection } = useExpandable()
    const [measureRef, { width, height }] = useMeasure()
    const animatedWidth = useMotionValue(collapsedSize.width || 0)
    const animatedHeight = useMotionValue(collapsedSize.height || 0)
    const smoothWidth = useSpring(animatedWidth, springConfig)
    const smoothHeight = useSpring(animatedHeight, springConfig)

    useEffect(() => {
      animatedWidth.set(isExpanded ? expandedSize.width || width : collapsedSize.width || width)
      animatedHeight.set(isExpanded ? expandedSize.height || height : collapsedSize.height || height)
    }, [isExpanded, collapsedSize, expandedSize, width, height, animatedWidth, animatedHeight])

    const handleHover = () => {
      if (hoverToExpand && !isExpanded) setTimeout(toggleExpand, expandDelay)
    }

    const handleHoverEnd = () => {
      if (hoverToExpand && isExpanded) setTimeout(toggleExpand, collapseDelay)
    }

    return (
      <motion.div
        ref={ref}
        className={cn("cursor-pointer", className)}
        style={{
          width: expandDirection === "vertical" ? collapsedSize.width : smoothWidth,
          height: expandDirection === "horizontal" ? collapsedSize.height : smoothHeight,
        }}
        transition={springConfig}
        onHoverStart={handleHover}
        onHoverEnd={handleHoverEnd}
        {...props}
      >
        <div ref={measureRef} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    )
  }
)
ExpandableCard.displayName = "ExpandableCard"

const ExpandableTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { toggleExpand } = useExpandable()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleExpand()
    }
  }

  return (
    <div
      ref={ref}
      onClick={toggleExpand}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Toggle expand"
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ExpandableTrigger.displayName = "ExpandableTrigger"

const ExpandableCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    <motion.div layout className="flex items-start justify-between">
      {children}
    </motion.div>
  </div>
))
ExpandableCardHeader.displayName = "ExpandableCardHeader"

const ExpandableCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex-grow overflow-hidden px-4 pb-4", className)} {...props}>
    <motion.div layout>{children}</motion.div>
  </div>
))
ExpandableCardContent.displayName = "ExpandableCardContent"

const ExpandableCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-4 pt-0", className)} {...props} />
))
ExpandableCardFooter.displayName = "ExpandableCardFooter"

export {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableContext,
  ExpandableTrigger,
  useExpandable,
}
