import { useFrame } from '@react-three/fiber'
import { RigidBody, BallCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { useRef } from 'react'

export function Pointer({ size = 0.5, vec = new THREE.Vector3() }) {
  const ref = useRef<any>(null!)

  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        1
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
