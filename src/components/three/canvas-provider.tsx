'use client'
import '@14islands/r3f-scroll-rig/css'

import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { useEffect, useRef, useState } from 'react'
import { useDeviceDetect } from '~/hooks/use-device-detect'
import { useAppStore } from '~/context/use-app-store'

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const eventSource = useRef<HTMLDivElement>(null!)
  const [isMounted, setIsMounted] = useState(false)
  const fontsLoaded = useAppStore((state) => state.fontsLoaded)
  const isMobile = useDeviceDetect().isMobile

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !fontsLoaded) {
    return <div ref={eventSource}>{children}</div>
  }

  return (
    <div ref={eventSource}>
      <GlobalCanvas
        eventSource={eventSource}
        eventPrefix="client"
        scaleMultiplier={0.01}
        camera={{ fov: 33 }}
        style={{ pointerEvents: 'none', zIndex: 100 }}
      />
      <SmoothScrollbar
        enabled={!isMobile}
        config={{
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          smooth: true,
          smoothTouch: false
        }}
      >
        {(bind) => <main {...bind}>{children}</main>}
      </SmoothScrollbar>
    </div>
  )
}
