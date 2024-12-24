'use client'
import '@14islands/r3f-scroll-rig/css'

import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { Suspense, useRef } from 'react'
import { Physics } from '@react-three/rapier'

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const eventSource = useRef<HTMLDivElement>(null!)

  return (
    <div ref={eventSource}>
      <GlobalCanvas
        eventSource={eventSource}
        eventPrefix="client"
        scaleMultiplier={0.01}
        camera={{ fov: 33 }}
        style={{ pointerEvents: 'none', zIndex: 100 }}
      >
        {(globalChildren) => (
          <>
            <Suspense fallback={null}>
              <Physics
                gravity={[0, 0, 0]}
                debug
                timeStep="vary"
                updatePriority={-100}
              >
                {globalChildren}
              </Physics>
            </Suspense>
          </>
        )}
      </GlobalCanvas>

      <SmoothScrollbar
        config={{
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2
        }}
      >
        {(bind) => <main {...bind}>{children}</main>}
      </SmoothScrollbar>
    </div>
  )
}
