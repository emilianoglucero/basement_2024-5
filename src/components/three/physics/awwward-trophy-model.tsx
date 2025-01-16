import { useTracker } from '@14islands/r3f-scroll-rig'
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { ASSETS } from '~/constants/assets'
import { useAppStore } from '~/context/use-app-store'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { GLTFResult } from '../types/gltf'
import { calculateViewportFactor } from '~/lib/utils/viewport'

const AwwwardTrophyModel = () => {
  const [animationState, setAnimationState] = useState<'intro' | 'active'>(
    'intro'
  )

  const { nodes, materials } = useGLTF(
    ASSETS.AWWWARDS.MODEL_PATH
  ) as unknown as GLTFResult
  const vector3 = new THREE.Vector3()
  const angle = new THREE.Vector3()
  const rotation = new THREE.Vector3()
  const targetPosition = new THREE.Vector3()
  let currentPosition = new THREE.Vector3()
  let distance = null
  const ref = useRef<any>(null!)
  const { trophyRef } = useAppStore()
  const [viewportFactor, setViewportFactor] = useState(() =>
    calculateViewportFactor()
  )

  useEffect(() => {
    const handleResize = () => {
      setViewportFactor(calculateViewportFactor())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const tracker = trophyRef
    ? useTracker(trophyRef, {
        rootMargin: '50%',
        threshold: 0,
        autoUpdate: true
      })
    : null

  const initialPosition = [
    (tracker?.position.x ?? 0) + (tracker?.scale.y ?? 0), // the trophy appears from the outside
    tracker?.position.y ?? 0,
    (tracker?.position.z ?? 0) + (tracker?.scale.z ?? 0)
  ]

  const INTRO_BASE_FORCE_MULTIPLIER = 30
  const INTRO_MAX_FORCE = 50
  const ACTIVE_BASE_FORCE_MULTIPLIER = 150
  const ACTIVE_MAX_FORCE = 200

  useFrame(() => {
    if (!ref.current || !tracker?.position) {
      return
    }

    // set target position
    targetPosition.set(
      tracker.position.x - tracker.scale.y * 0.2,
      tracker.position.y,
      tracker.position.z + tracker.scale.z
    )

    // calculate direction and distance
    vector3.subVectors(targetPosition, currentPosition)
    distance = vector3.length()

    switch (animationState) {
      case 'intro': {
        currentPosition = ref.current.translation()
        vector3.set(currentPosition.x, currentPosition.y, currentPosition.z)

        // calculate direction and distance
        vector3.subVectors(targetPosition, currentPosition)
        distance = vector3.length()

        const introForceMagnitude = Math.min(
          distance * INTRO_BASE_FORCE_MULTIPLIER * viewportFactor,
          INTRO_MAX_FORCE * viewportFactor
        )
        ref.current.applyImpulse(
          vector3.normalize().multiplyScalar(introForceMagnitude),
          true
        )

        if (distance < 0.05) {
          setAnimationState('active')
        }
        break
      }

      case 'active': {
        currentPosition = ref.current.translation()
        vector3.set(currentPosition.x, currentPosition.y, currentPosition.z)

        // calculate direction and distance
        vector3.subVectors(targetPosition, currentPosition)
        distance = vector3.length()

        const forceMagnitude = Math.min(
          distance * ACTIVE_BASE_FORCE_MULTIPLIER * viewportFactor,
          ACTIVE_MAX_FORCE * viewportFactor
        )
        ref.current.applyImpulse(
          vector3.normalize().multiplyScalar(forceMagnitude),
          true
        )

        // stabilize the rotation
        angle.copy(ref.current.angvel())
        rotation.copy(ref.current.rotation())

        ref.current.setAngvel({
          x: angle.x - rotation.x * 3,
          y: angle.y - rotation.y * 3,
          z: angle.z - rotation.z * 3
        })

        break
      }
    }
  })

  if (!tracker?.position || !materials || !nodes || tracker.scale.x === 0) {
    return null
  }

  return (
    <RigidBody
      ref={ref}
      position={initialPosition}
      type="dynamic"
      colliders="cuboid"
      linearDamping={animationState === 'active' ? 40 : 20}
      angularDamping={15}
      enabledRotations={[true, true, true]}
      scale={tracker.scale.x}
    >
      <group dispose={null}>
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

export default AwwwardTrophyModel
