import { useFrame } from '@react-three/fiber'

import { Float, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

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

const AwwwardsTrophyModel = ({ scale, model }: TrophyModelProps) => {
  const meshRef = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF(model) as unknown as GLTFResult
  const [scrollY, setScrollY] = useState(0)

  const initialRotation = -0.15

  useEffect(() => {
    const handleScroll = () => {
      // get normalized scroll position (0 to 1)
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const normalized = window.scrollY / maxScroll
      setScrollY(normalized)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      // interpolate smoothly between current rotation and target rotation
      const targetRotation = initialRotation + scrollY * Math.PI * 10
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.1
      )
    }
  })

  const minScale = Array.isArray(scale)
    ? Math.min(scale[0], scale[1])
    : Math.min(scale.x, scale.y)

  return (
    <group scale={minScale}>
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.65}>
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
      </Float>
    </group>
  )
}

export default AwwwardsTrophyModel
