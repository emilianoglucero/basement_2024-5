'use client'
import '@14islands/r3f-scroll-rig/css'

import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { Suspense, useRef } from 'react'

import { Pointer } from './physics/pointer'
import AwwwardTrophyModel from './physics/awwward-trophy-model'
import { useDeviceDetect } from '~/hooks/use-device-detect'

import { Physics } from '@react-three/rapier'
export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const eventSource = useRef<HTMLDivElement>(null!)
  const isMobile = useDeviceDetect().isMobile

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
          <Suspense>
            <Physics gravity={[0, 2, 0]} colliders="cuboid">
              <Pointer size={0.5} />
              <AwwwardTrophyModel />
              {globalChildren}
            </Physics>
          </Suspense>
        )}
      </GlobalCanvas>

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
