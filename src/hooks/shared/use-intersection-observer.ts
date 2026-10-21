"use client"

import { useEffect, useRef } from "react"

interface UseIntersectionObserverProps {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
  threshold?: number | number[]
  rootRef?: React.RefObject<Element | null>
}

/**
 * Lightweight, robust hook to trigger callback when sentinel element enters viewport
 */
export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = "250px",
  threshold = 0.1,
  rootRef,
}: UseIntersectionObserverProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const callbackRef = useRef(onIntersect)

  useEffect(() => {
    callbackRef.current = onIntersect
  })

  useEffect(() => {
    if (!enabled) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          callbackRef.current()
        }
      },
      {
        root: rootRef?.current || null,
        rootMargin,
        threshold,
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, rootMargin, threshold, rootRef])

  return sentinelRef
}
