import { useTracker } from '@14islands/r3f-scroll-rig'
import { useGLTF } from '@react-three/drei'
import { useRef, useState } from 'react'
import { ASSETS } from '~/constants/assets'
import { useAppStore } from '~/context/use-app-store'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { GLTFResult } from '../types/gltf'

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
  const tracker = useTracker(trophyRef, {
    rootMargin: '50%',
    threshold: 0,
    autoUpdate: true
  })

  const initialPosition = [
    tracker.position.x + tracker.scale.y, // the trophy appears from the outside
    tracker.position.y,
    tracker.position.z + tracker.scale.z
  ]

  const { viewport } = useThree()

  const calculateViewportFactor = () => {
    // reference viewport sizes (in THREE units)
    const MOBILE_AREA = 3 * 6 // approximate mobile viewport
    const DESKTOP_AREA = 12 * 8 // approximate desktop viewport

    // current viewport area using reactive viewport values
    const currentArea = viewport.width * viewport.height

    // simple linear interpolation between size ranges
    let factor
    if (currentArea <= MOBILE_AREA) {
      // Mobile and smaller: 0.2 to 0.5
      factor = THREE.MathUtils.mapLinear(currentArea, 0, MOBILE_AREA, 0.2, 0.5)
    } else if (currentArea <= DESKTOP_AREA) {
      // tablet to desktop: 0.5 to 1.5
      factor = THREE.MathUtils.mapLinear(
        currentArea,
        MOBILE_AREA,
        DESKTOP_AREA,
        0.5,
        1.5
      )
    } else {
      // larger than desktop: 1.5 to 3.0
      factor = THREE.MathUtils.mapLinear(
        currentArea,
        DESKTOP_AREA,
        DESKTOP_AREA * 2,
        1.5,
        3.0
      )
    }

    return factor
  }

  useFrame(() => {
    if (!ref.current || !tracker.position) {
      return
    }

    const viewportFactor = calculateViewportFactor()

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
          distance * 30 * viewportFactor,
          50 * viewportFactor
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
          distance * 150 * viewportFactor,
          200 * viewportFactor
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

  if (!tracker.position || !materials || !nodes || tracker.scale.x === 0) {
    return null
  }

  return (
    <RigidBody
      position={initialPosition}
      type="dynamic"
      colliders="cuboid"
      ref={ref}
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
