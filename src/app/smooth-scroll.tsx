'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }

    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,     // el RAF lo maneja Motion
        lerp: 0.1,          // 0.05 = muy "flotante", 0.15 = más directo
        wheelMultiplier: 1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}