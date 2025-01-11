import { useTracker } from '@14islands/r3f-scroll-rig'
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { ASSETS } from '~/constants/assets'
import { useAppStore } from '~/context/use-app-store'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { GLTFResult } from '../types/gltf'

const AwwwardTrophyModel = () => {
  const lastScrollProgress = useRef(0)
  const { nodes, materials } = useGLTF(
    ASSETS.AWWWARDS.MODEL_PATH
  ) as unknown as GLTFResult
  const vector3 = new THREE.Vector3()
  const angle = new THREE.Vector3()
  const rotation = new THREE.Vector3()
  const targetPosition = new THREE.Vector3()

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
    tracker.position.z
  ]

  useFrame(() => {
    if (ref.current && tracker.position) {
      // get current position
      const currentPosition = ref.current.translation()
      vector3.set(currentPosition.x, currentPosition.y, currentPosition.z)

      //set target position
      targetPosition.set(
        tracker.position.x - tracker.scale.y * 0.2,
        tracker.position.y,
        tracker.position.z + tracker.scale.z
      )

      //calculate the direction to target position
      const direction = vector3.subVectors(targetPosition, vector3)
      const distance = direction.length()

      // apply force proportional to distance
      const forceMagnitude = Math.min(distance * 200, 300)
      ref.current.applyImpulse(
        direction.normalize().multiplyScalar(forceMagnitude),
        true
      )

      const scrollProgress = tracker.scrollState.progress

      if (scrollProgress !== lastScrollProgress.current) {
        // calculate initial rotation to face camera
        const angleToCamera = Math.atan2(currentPosition.x, currentPosition.z)
        // add scroll rotation to initial angle
        const targetRotationY = angleToCamera - scrollProgress * Math.PI * 2

        //get current rotation
        const currentRotation = ref.current.rotation()

        // calculate rotation difference and apply torque
        const rotationDifference = targetRotationY - currentRotation.y
        ref.current.applyTorqueImpulse(
          new THREE.Vector3(0, rotationDifference * 20, 0),
          true
        )

        // stabilize the rotation
        angle.copy(ref.current.angvel())
        rotation.copy(ref.current.rotation())
        ref.current.setAngvel({
          x: angle.x - rotation.x * 5,
          y: angle.y - rotation.y * 5 + angleToCamera,
          z: angle.z - rotation.z * 5
        })
        lastScrollProgress.current = scrollProgress
      }
    }
  })

  if (!tracker.position || !materials || !nodes || tracker.scale.x === 0)
    return null
  return (
    <RigidBody
      position={initialPosition}
      type="dynamic"
      colliders="cuboid"
      ref={ref}
      linearDamping={40}
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
