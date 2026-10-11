'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const pathname = usePathname()

  useEffect(() => {

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }

    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  // Lenis ignores hash jumps unless `anchors` is on, and it keeps the previous
  // scroll on client navigations. Honor the URL hash, otherwise start at the top.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis) return

    const hash = window.location.hash
    if (hash.length > 1) {
      const id = decodeURIComponent(hash.slice(1))
      if (document.getElementById(id)) {
        lenis.scrollTo(hash, { immediate: true })
        return
      }
    }

    lenis.scrollTo(0, { immediate: true })
  }, [pathname])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,     // el RAF lo maneja Motion
        lerp: 0.1,          // 0.05 = muy "flotante", 0.15 = más directo
        wheelMultiplier: 1,
        smoothWheel: true,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}