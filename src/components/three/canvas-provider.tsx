'use client'
import '@14islands/r3f-scroll-rig/css'

import {
  GlobalCanvas,
  SmoothScrollbar,
  useTracker
} from '@14islands/r3f-scroll-rig'
import { Suspense, useRef } from 'react'
import { useDeviceDetect } from '~/hooks/use-device-detect'
import { useGLTF } from '@react-three/drei'
import { BallCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '~/context/use-app-store'
import { GLTFResult } from '~/app/sections/falling-caps/webgl-model/types'
import { ASSETS } from '~/constants/assets'
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

function TrackedBox() {
  const { nodes, materials } = useGLTF(
    ASSETS.AWWWARDS.MODEL_PATH
  ) as unknown as GLTFResult
  const vector3 = new THREE.Vector3()
  const angle = new THREE.Vector3()
  const rotation = new THREE.Vector3()

  const ref = useRef(null!)
  const { trophyRef } = useAppStore()
  const tracker = useTracker(trophyRef, {
    rootMargin: '50%',
    threshold: 0,
    autoUpdate: true
  })

  const initialPosition = [
    tracker.position.x + 4,
    tracker.position.y,
    tracker.position.z
  ]

  useFrame(() => {
    if (ref.current && tracker.position) {
      // get current position
      const currentPosition = ref.current.translation()
      vector3.set(currentPosition.x, currentPosition.y, currentPosition.z)

      //calculate the direction to target position
      const direction = vector3.subVectors(tracker.position, vector3)
      const distance = direction.length()

      // apply force proportional to distance
      const forceMagnitude = Math.min(distance * 10, 10) // force
      ref.current.applyImpulse(
        direction.normalize().multiplyScalar(forceMagnitude),
        true
      )

      // stabilize the rotation
      angle.copy(ref.current.angvel())
      rotation.copy(ref.current.rotation())
      ref.current.setAngvel({
        x: angle.x - rotation.x * 5,
        y: angle.y - rotation.y * 5,
        z: angle.z - rotation.z * 5
      })
    }
  })

  if (!tracker.position || !materials || !nodes) return null
  console.log('tracker.scale.x', tracker.scale.x)

  return (
    <RigidBody
      position={initialPosition}
      type="dynamic"
      colliders="cuboid"
      ref={ref}
      linearDamping={6}
      angularDamping={4}
      restitution={0}
      friction={1}
      scale={3}
    >
      <group rotation-y={-0.15} dispose={null}>
        <mesh
          geometry={nodes.Cube001.geometry}
          material={materials.m_Trophy3}
        />
        <mesh
          geometry={nodes.Cube001_1.geometry}
          material={materials.m_Outline}
        />
      </group>
    </RigidBody>
  )
}
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
            <Physics gravity={[0, 2, 0]} colliders="cuboid" debug>
              <ambientLight intensity={0.5} />
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
