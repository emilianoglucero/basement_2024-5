import { Float, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'
import { BallCollider, CuboidCollider, RigidBody } from '@react-three/rapier'

interface GLTFResult extends GLTF {
  nodes: {
    Cube001: THREE.Mesh
    Cube001_1: THREE.Mesh
  }
  materials: {
    m_Trophy3: THREE.Material
    m_Outline: THREE.Material
  }
}

interface TrophyModelProps {
  scale: THREE.Vector3 | [number, number, number]
  model: string
  scrollState?: {
    progress: number
  }
}

function Pointer({ size = 0.5, vec = new THREE.Vector3() }) {
  const ref = useRef<RAPIER.RigidBodyApi>(null!)
  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        1.5
      )
    )
  })
  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[size]} />
      <mesh visible={false}>
        <sphereGeometry args={[size, 16, 64]} />
        <meshBasicMaterial color="indianred" />
      </mesh>
    </RigidBody>
  )
}

const AwwwardsTrophyModel = ({
  scale,
  model,
  scrollState,
  ...props
}: TrophyModelProps) => {
  const rigidBody = useRef<RAPIER.RigidBodyApi>(null!)
  const meshRef = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF(model) as unknown as GLTFResult
  const [scrollY, setScrollY] = useState(0)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const initialRotation = -0.15

  // define the target position where the trophy should return to
  const targetPosition = new THREE.Vector3(6, -2, 2)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const normalized = window.scrollY / maxScroll
      setScrollY(normalized)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || !rigidBody.current) return

    delta = Math.min(0.1, delta)

    // apply scroll-based rotation to visual mesh
    const targetRotation = initialRotation + scrollY * Math.PI * 10
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation,
      0.1
    )

    // get current position
    const currentPosition = rigidBody.current.translation()
    vec.set(currentPosition.x, currentPosition.y, currentPosition.z)

    // calculate direction to target position
    const direction = vec.subVectors(targetPosition, vec)
    const distance = direction.length()

    // apply force proportional to distance
    const forceMagnitude = Math.min(distance * 10, 10) // force
    rigidBody.current.applyImpulse(
      direction.normalize().multiplyScalar(forceMagnitude),
      true
    )

    // Stabilize rotation
    ang.copy(rigidBody.current.angvel())
    rot.copy(rigidBody.current.rotation())
    rigidBody.current.setAngvel({
      x: ang.x - rot.x * 5,
      y: ang.y - rot.y * 5,
      z: ang.z - rot.z * 5
    })
  })

  const minScale = Array.isArray(scale)
    ? Math.min(scale[0], scale[1])
    : Math.min(scale.x, scale.y)

  return (
    <>
      <Pointer size={0.2} />
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.65}>
        <RigidBody
          ref={rigidBody}
          type="dynamic"
          colliders={false}
          linearDamping={6}
          angularDamping={4}
          restitution={0}
          friction={1}
          mass={1}
          position={targetPosition.toArray()}
          enabledRotations={[true, true, true]}
        >
          <group scale={minScale}>
            <group ref={meshRef} rotation-y={initialRotation} dispose={null}>
              <mesh
                geometry={nodes.Cube001.geometry}
                material={materials.m_Trophy3}
              />
              <mesh
                geometry={nodes.Cube001_1.geometry}
                material={materials.m_Outline}
              />
            </group>
          </group>
          <CuboidCollider args={[1, 1.65, 1]} position={[0, 0.5, 0]} />
        </RigidBody>
      </Float>
    </>
  )
}

export default AwwwardsTrophyModel
