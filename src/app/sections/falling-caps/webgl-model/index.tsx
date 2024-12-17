import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { GLTF } from 'three-stdlib'
import * as THREE from 'three'

interface GLTFResult extends GLTF {
  nodes: {
    Sphere007: THREE.Mesh
    Sphere007_1: THREE.Mesh
  }
  materials: {
    'm_Cap-v2': THREE.Material
    m_Outline: THREE.Material
  }
}

interface WebGLModelProps {
  model: string
  scale: THREE.Vector3 | [number, number, number]
  inViewport: boolean
  style: React.CSSProperties
}

const extractTransformValues = (transform: string) => {
  const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
  const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/)

  return {
    scale: scaleMatch?.[1] ? parseFloat(scaleMatch[1]) : 1,
    rotation: rotateMatch?.[1]
      ? (-parseFloat(rotateMatch[1]) * Math.PI) / 180
      : 0
  }
}

const WebGLModel = ({ model, scale, style }: WebGLModelProps) => {
  const meshRef = useRef<any>(null!)
  const { nodes, materials } = useGLTF(model) as unknown as GLTFResult

  // Extract transform values from style
  const transformValues = useMemo(() => {
    if (style?.transform) {
      return extractTransformValues(style.transform)
    }
    return { scale: 1, rotation: 0 }
  }, [style?.transform])

  // Base scale for the model
  const baseScale = Array.isArray(scale)
    ? Math.min(scale[0], scale[1])
    : Math.min(scale.x, scale.y) * 0.75

  // Calculate final scale
  const finalScale = useMemo(() => {
    const relativeScale = transformValues.scale * baseScale
    return [relativeScale, relativeScale, relativeScale] as [
      number,
      number,
      number
    ]
  }, [baseScale, transformValues.scale])

  return (
    <group ref={meshRef} scale={finalScale}>
      <group rotation={[0.2, 0, 0]}>
        <group rotation={[0, transformValues.rotation, 0]}>
          <mesh
            geometry={nodes.Sphere007.geometry}
            material={materials['m_Cap-v2']}
          />
          <mesh
            geometry={nodes.Sphere007_1.geometry}
            material={materials.m_Outline}
          />
        </group>
      </group>
    </group>
  )
}

export default WebGLModel
