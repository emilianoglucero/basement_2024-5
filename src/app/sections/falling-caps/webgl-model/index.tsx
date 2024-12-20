import { Float, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { gsap } from '~/lib/gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

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
  index: number
  totalCaps: number
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
  // Handle horizontal position (left or right)
  let leftPercent = 0
  if (style.left !== undefined) {
    leftPercent = parseFloat(style.left?.toString() || '0')
  } else if (style.right !== undefined) {
    leftPercent = 100 - parseFloat(style.right?.toString() || '0')
  }

  // Handle vertical position (top or bottom)
  let topPercent = 0
  if (style.top !== undefined) {
    topPercent = parseFloat(style.top?.toString() || '0')
  } else if (style.bottom !== undefined) {
    topPercent = 100 - parseFloat(style.bottom?.toString() || '0')
  }

  // use viewport aspect ratio to calculate world coordinates
  const aspect = window.innerWidth / window.innerHeight
  const viewportHeight = 6 // adjust this value to control the overall scale
  const viewportWidth = viewportHeight * aspect

  // Map percentages to world coordinates
  const x = (leftPercent / 100) * viewportWidth - viewportWidth / 2
  const y = viewportHeight / 2 - (topPercent / 100) * viewportHeight

  return [x, y, 0] as [number, number, number]
}

export const shuffleArray = (array: number[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = newArray[i]
    if (temp !== undefined && newArray[j] !== undefined) {
      ;[newArray[i], newArray[j]] = [newArray[j], temp]
    }
  }
  return newArray
}

const WebGLModel = ({
  model,
  scale,
  style,
  index,
  totalCaps
}: WebGLModelProps) => {
  const meshRef = useRef<any>(null!)
  const { nodes, materials } = useGLTF(model) as unknown as GLTFResult
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // handle window resize
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    const viewportScale = Math.min(viewport.width, viewport.height) / 1000 // Adjust divisor to control base scale
    const relativeScale = transformValues.scale * baseScale * viewportScale
    return [relativeScale, relativeScale, relativeScale] as [
      number,
      number,
      number
    ]
  }, [baseScale, transformValues.scale, viewport])

  // Calculate position from CSS style
  const position = useMemo(() => {
    return convertCSSToWorldPosition(style)
  }, [style, viewport])

  useIsomorphicLayoutEffect(() => {
    if (!meshRef.current) return
    const trigger = document.getElementById('caps-section')

    // define the main animation zone (between 10% and 90% of scroll)
    const animationStart = 0.1 // 10% of scroll
    const animationEnd = 0.9 // 90% of scroll
    const animationSpace = animationEnd - animationStart

    // calculate segment size within the animation space
    const segmentSize = animationSpace / totalCaps

    // calculate start and end positions for this cap
    const startPosition = animationStart + index * segmentSize
    const endPosition = startPosition + segmentSize

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: `top+=${startPosition * 100}% center`,
        end: `top+=${endPosition * 100}% center`,
        scrub: 1
      }
    })

    // set initial position
    meshRef.current.position.set(position[0], position[1] - 2, position[2])
    meshRef.current.scale.set(0, 0, 0)
    meshRef.current.rotation.set(-0.2, -0.4, -0.2)

    // animate using separate properties
    timeline
      .to(meshRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 1,
        ease: 'power2.out'
      })
      .to(
        meshRef.current.rotation,
        {
          x: 0.2,
          y: transformValues.rotation,
          z: 0,
          duration: 1,
          ease: 'power2.out'
        },
        0
      )
      .to(
        meshRef.current.scale,
        {
          x: finalScale[0] * 0.45,
          y: finalScale[1] * 0.45,
          z: finalScale[2] * 0.45,
          duration: 1,
          ease: 'power2.out'
        },
        0
      )

    return () => {
      timeline.scrollTrigger?.kill()
    }
  }, [finalScale, index, totalCaps, position, transformValues.rotation])

  return (
    <group
      ref={meshRef}
      scale={[finalScale[0] * 0.45, finalScale[1] * 0.45, finalScale[2] * 0.45]}
      position={[position[0], position[1], 0]}
      rotation={[0.2, transformValues.rotation, 0]}
    >
      <Float speed={1.2} floatIntensity={1}>
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
