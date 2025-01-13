import { useFrame } from '@react-three/fiber'
import { RigidBody, BallCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { useRef } from 'react'

export function Pointer({ size = 0.5, vec = new THREE.Vector3() }) {
  const ref = useRef<any>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        1
      )
    )

    if (meshRef.current) {
      meshRef.current.visible = false
    }
  })

  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[size]} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 64]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </RigidBody>
  )
}
