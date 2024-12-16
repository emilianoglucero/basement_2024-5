import { useImageAsTexture } from '@14islands/r3f-scroll-rig'
import { useRef, useState } from 'react'
import { clamp } from 'three/src/math/MathUtils'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { chromaticEffect } from '~/lib/shaders/effects/chromatic'

interface WebGLImageProps {
  imgRef: React.RefObject<HTMLImageElement>
  scrollState: any
  scale: THREE.Vector3 | [number, number, number]
  shaderEffect?: {
    vertex: string
    fragment: string
    uniforms?: Record<string, any>
  }
}

const CustomImageMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uHover: 0,
    uResolution: new THREE.Vector2(1, 1),
    grayscale: 0,
    zoom: 1,
    opacity: 1
  },
  chromaticEffect.vertex,
  chromaticEffect.fragment
)

extend({
  CustomImageMaterial
})

declare module '@react-three/fiber' {
  interface ThreeElements {
    customImageMaterial: ThreeElements['meshStandardMaterial'] & {
      uTexture?: THREE.Texture
      uTime?: number
      uHover?: number
      grayscale?: number
      zoom?: number
      opacity?: number
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    defaultImageMaterial: ThreeElements['meshStandardMaterial'] & {
      uTexture?: THREE.Texture
      uTime?: number
      uHover?: number
      grayscale?: number
      zoom?: number
      opacity?: number
    }
  }
}

export const WebGLImage = ({ imgRef, scrollState, scale }: WebGLImageProps) => {
  const meshRef = useRef<any>(null!)
  const texture = useImageAsTexture(imgRef)
  const [hovered, setHovered] = useState(false)
  const time = useRef(0)

  useFrame(() => {
    if (!meshRef.current?.material) return

    time.current += 0.01
    meshRef.current.material.uTime = time.current

    meshRef.current.material.uHover = THREE.MathUtils.lerp(
      meshRef.current.material.uHover,
      hovered ? 1 : 0,
      0.1
    )

    meshRef.current.material.grayscale = clamp(
      1 - scrollState.visibility ** 3,
      0,
      1
    )
    meshRef.current.material.zoom = 1 + scrollState.progress * 0.66
    meshRef.current.material.opacity = clamp(scrollState.viewport * 3, 0, 1)
  })

  return (
    <mesh
      ref={meshRef}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry />
      <customImageMaterial
        uTexture={texture}
        uTime={0}
        uHover={0}
        transparent
      />
    </mesh>
  )
}
