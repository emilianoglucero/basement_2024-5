'use client'
import '@14islands/r3f-scroll-rig/css'

import {
  GlobalCanvas,
  SmoothScrollbar,
  useTracker
} from '@14islands/r3f-scroll-rig'
import { Suspense, useRef } from 'react'
import { useDeviceDetect } from '~/hooks/use-device-detect'
import { Box } from '@react-three/drei'
import { BallCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '~/context/use-app-store'
function Pointer({ size = 0.5, vec = new THREE.Vector3() }) {
  const ref = useRef(null!)
  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      )
    )
  })
  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[size]} />
      <mesh visible={false}>
        <sphereGeometry args={[size, 16, 64]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </RigidBody>
  )
}

function TrackedBox({ size = 2, vec = new THREE.Vector3() }) {
  const ref = useRef(null!)
  const { trophyRef } = useAppStore()
  const tracker = useTracker(trophyRef, {
    rootMargin: '50%',
    threshold: 0,
    autoUpdate: true
  })
  console.log('tracker', tracker)

  useFrame(() => {
    if (ref.current && tracker.position) {
      const yOffset = tracker.scrollState.progress
      ref.current.setNextKinematicTranslation(
        vec.set(
          tracker.position.x,
          tracker.position.y + yOffset,
          tracker.position.z || 0
        )
      )
    }
  })

  return (
    <RigidBody
      type="kinematicPosition"
      colliders="cuboid"
      ref={ref}
      linearDamping={6}
      angularDamping={4}
      restitution={0}
      friction={1}
    >
      <Box args={[size, size, size]} rotation={[0.15, 0.15, 0.15]}>
        <meshStandardMaterial color="turquoise" />
      </Box>
    </RigidBody>
  )
}
export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const eventSource = useRef<HTMLDivElement>(null!)
  const isMobile = useDeviceDetect().isMobile
  const boxRef = useRef<RigidBody>(null!)

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
            <Physics gravity={[0, 2, 0]} debug colliders="cuboid">
              <mesh position={[3, 0, 0]}>
                <RigidBody
                  ref={boxRef}
                  type="dynamic"
                  colliders="cuboid"
                  linearDamping={6}
                  angularDamping={4}
                  restitution={0}
                  friction={1}
                  mass={1}
                  enabledRotations={[true, true, true]}
                >
                  <Box args={[2, 2, 2]} rotation={[0.15, 0.15, 0.15]} />
                </RigidBody>
              </mesh>
              <Pointer size={0.5} />
              <TrackedBox size={2} />
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
