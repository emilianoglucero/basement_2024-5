import { Float, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { gsap } from '~/lib/gsap'
import { ScrollTrigger } from 'gsap/all'
import {
  extractTransformValues,
  calculateFinalScale,
  calculateBaseScale,
  convertCSSToWebGLPosition
} from './utils'
import { calculateAnimationTimings } from './animation'
import { GLTFResult, WebGLModelProps } from './types'

gsap.registerPlugin(ScrollTrigger)

const WebGLModel = ({
  model,
  scale,
  style,
  index,
  totalCaps
}: WebGLModelProps) => {
  const meshRef = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF(model) as unknown as GLTFResult
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

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

  const transformValues = useMemo(() => {
    return style?.transform
      ? extractTransformValues(style.transform)
      : { scale: 1, rotation: 0 }
  }, [style?.transform])

  const baseScale = useMemo(() => calculateBaseScale(scale), [scale])

  const finalScale = useMemo(
    () => calculateFinalScale(viewport, baseScale, transformValues),
    [viewport, baseScale, transformValues]
  )

  const position = useMemo(() => convertCSSToWebGLPosition(style), [style])

  useIsomorphicLayoutEffect(() => {
    if (!meshRef.current) return
    const trigger = document.getElementById('caps-section')

    const { startPosition, endPosition } = calculateAnimationTimings(
      index,
      totalCaps
    )

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: `top+=${startPosition * 100}% center`,
        end: `top+=${endPosition * 100}% center`,
        scrub: 1
      }
    })

    const initialState = {
      position: [position[0], position[1] - 2, position[2]] as [
        number,
        number,
        number
      ],
      scale: [0, 0, 0] as [number, number, number],
      rotation: [-0.2, -0.4, -0.2] as [number, number, number]
    }

    const finalState = {
      position: position,
      scale: finalScale.map((s) => s * 0.45),
      rotation: [0.2, transformValues.rotation, 0]
    }

    meshRef.current.position.set(...initialState.position)
    meshRef.current.scale.set(...initialState.scale)
    meshRef.current.rotation.set(...initialState.rotation)

    timeline
      .to(meshRef.current.position, {
        x: finalState.position[0],
        y: finalState.position[1],
        z: finalState.position[2],
        duration: 1,
        ease: 'power2.out'
      })
      .to(
        meshRef.current.rotation,
        {
          x: finalState.rotation[0],
          y: finalState.rotation[1],
          z: finalState.rotation[2],
          duration: 1,
          ease: 'power2.out'
        },
        0
      )
      .to(
        meshRef.current.scale,
        {
          x: finalState.scale[0],
          y: finalState.scale[1],
          z: finalState.scale[2],
          duration: 1,
          ease: 'power2.out'
        },
        0
      )

    return () => {
      timeline.scrollTrigger?.kill()
    }
  }, [finalScale, index, totalCaps, position, transformValues.rotation])

  const scaleFactor = 0.45

  return (
    <group
      ref={meshRef}
      scale={[
        finalScale[0] * scaleFactor,
        finalScale[1] * scaleFactor,
        finalScale[2] * scaleFactor
      ]}
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
