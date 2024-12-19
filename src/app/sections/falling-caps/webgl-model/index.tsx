import { Float, useGLTF } from '@react-three/drei'
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

const convertCSSToWorldPosition = (style: React.CSSProperties) => {
  // Remove % and convert to numbers
  const leftPercent = parseFloat(style.left?.toString() || '0')
  const topPercent = parseFloat(style.top?.toString() || '0')

  // Map percentages to world coordinates
  // left: 0% -> -6, 100% -> 6
  const x = (leftPercent / 100) * 12 - 6

  // top: 0% -> 3, 100% -> -3 (inverted because CSS top goes down)
  const y = 3 - (topPercent / 100) * 6

  return [x, y, 0] as [number, number, number]
}

const WebGLModel = ({ model, scale, style }: WebGLModelProps) => {
  console.log('style', style)
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
  // TODO: review this
  const baseScale = Array.isArray(scale)
    ? Math.min(scale[0], scale[1])
    : Math.min(scale.x, scale.y)

  // Calculate final scale
  const finalScale = useMemo(() => {
    const relativeScale = transformValues.scale * baseScale
    return [relativeScale, relativeScale, relativeScale] as [
      number,
      number,
      number
    ]
  }, [baseScale, transformValues.scale])

  // position values: x: 6 to -6, y: 3 to -3, z: 0
  // Calculate position from CSS style
  const position = useMemo(() => {
    return convertCSSToWorldPosition(style)
  }, [style])
  console.log('position', position)
  console.log('transformValues', transformValues)

  return (
    <group
      ref={meshRef}
      scale={[finalScale[0] * 0.45, finalScale[1] * 0.45, finalScale[2] * 0.45]}
      position={position}
      rotation={[0.3, Math.PI * 4 + transformValues.rotation, 0]}
    >
      <Float speed={0.75} floatIntensity={0.5}>
        <mesh
          geometry={nodes.Sphere007.geometry}
          material={materials['m_Cap-v2']}
        />
        <mesh
          geometry={nodes.Sphere007_1.geometry}
          material={materials.m_Outline}
        />
      </Float>
    </group>
  )
}

export default WebGLModel
