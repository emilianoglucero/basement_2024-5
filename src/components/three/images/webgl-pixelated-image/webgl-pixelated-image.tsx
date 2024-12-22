import { useImageAsTexture } from '@14islands/r3f-scroll-rig'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { basementOrange } from '~/lib/constants'
import { gsap } from '~/lib/gsap'
import { pixelatedlEffect, PIXELS } from '~/lib/shaders/effects/pixelated'
gsap.registerPlugin(ScrollTrigger)

interface WebGLPixelatedImageProps {
  imgRef: React.RefObject<HTMLImageElement>
  scale: THREE.Vector3 | [number, number, number]
  uEffectType?: number
  fillColor?: string
  animation?: {
    duration?: number
    delay?: number
    ease?: string
    hoverIntensity?: number
    hoverEaseFactor?: number
    mouseEaseFactor?: number
    scroll?: {
      trigger?: string | Element
      start?: string
      end?: string
      scrub?: boolean | number
      markers?: boolean
      toggleActions?: string
      pin?: boolean
    }
  }
}

const CustomImageMaterial = shaderMaterial(
  {
    uTexture: null,
    uProgress: 0,
    uEffectType: 0,
    uFillColor: new THREE.Color(basementOrange),
    uPixels: null,
    uTextureSize: new THREE.Vector2(1, 1),
    uElementSize: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(),
    uPrevMouse: new THREE.Vector2()
  },
  pixelatedlEffect.vertex,
  pixelatedlEffect.fragment
)

extend({ CustomImageMaterial })

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      customImageMaterial: {
        uTexture: THREE.Texture | null
        uProgress: number
        uEffectType: number
        uFillColor: THREE.Color
        uPixels: number[] | null
        uTextureSize: THREE.Vector2
        uElementSize: THREE.Vector2
        transparent?: boolean
        uMouse?: THREE.Vector2
        uPrevMouse?: THREE.Vector2
      }
    }
  }
}

export const WebGLPixelatedImage = ({
  uEffectType,
  imgRef,
  scale,
  fillColor = basementOrange,
  animation = {
    duration: 1.2,
    delay: 0.1,
    ease: 'power2.out',
    hoverIntensity: 1.2,
    hoverEaseFactor: 0.1,
    mouseEaseFactor: 0.03,
    scroll: {
      trigger: undefined,
      start: 'top-=70% top',
      end: 'bottom bottom',
      markers: true
    }
  }
}: WebGLPixelatedImageProps) => {
  const [meshRef, setMeshRef] = useState<any>(null)
  const texture = useImageAsTexture(imgRef)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [targetPosition, setTargetPosition] = useState({ x: 0.5, y: 0.5 })
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0.5, y: 0.5 })
  const animationPlayedRef = useRef(false)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const handlePointerMove = (event: any) => {
    if (!isHovered) return
    const x = event.uv!.x
    const y = event.uv!.y
    setPrevMousePosition({ ...targetPosition })
    setTargetPosition({ x, y })
  }

  // kill previous timeline
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        const st = timelineRef.current.scrollTrigger
        if (st) {
          st.kill()
        }
        timelineRef.current.kill()
      }
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!meshRef?.material || !texture || animationPlayedRef.current) return

    const initializeAnimation = () => {
      meshRef.material.uProgress = 0
      meshRef.material.enableHoverEffects = false

      const animationConfig = {
        uProgress: 1,
        duration: animation.duration || 1.2,
        delay: animation.delay || 0,
        ease: animation.ease || 'power2.out',
        onComplete: () => {
          if (meshRef.material) {
            meshRef.material.enableHoverEffects = true
            animationPlayedRef.current = true
          }
        }
      }

      // kill any existing timeline
      if (timelineRef.current) {
        const st = timelineRef.current.scrollTrigger
        if (st) {
          st.kill()
        }
        timelineRef.current.kill()
      }

      if (animation.scroll?.trigger) {
        timelineRef.current = gsap.timeline({
          scrollTrigger: {
            trigger: animation.scroll.trigger,
            start: animation.scroll.start || 'top-=40% top',
            end: animation.scroll.end || 'bottom bottom',
            markers: animation.scroll.markers || false,
            once: true,
            onEnter: () => {
              animationPlayedRef.current = true
            }
          }
        })

        timelineRef.current.to(meshRef.material, animationConfig)
      } else {
        gsap.to(meshRef.material, animationConfig)
      }
    }

    initializeAnimation()
  }, [meshRef, texture, animation])

  useFrame(() => {
    if (!meshRef?.material) return

    setMousePosition((prev) => ({
      x: prev.x + (targetPosition.x - prev.x) * animation.mouseEaseFactor!,
      y: prev.y + (targetPosition.y - prev.y) * animation.mouseEaseFactor!
    }))

    meshRef.material.uMouse.set(mousePosition.x, mousePosition.y)
    meshRef.material.uPrevMouse.set(prevMousePosition.x, prevMousePosition.y)

    if (meshRef.material.enableHoverEffects) {
      meshRef.material.uProgress = THREE.MathUtils.lerp(
        meshRef.material.uProgress,
        isHovered ? animation.hoverIntensity! : 1.0,
        animation.hoverEaseFactor!
      )
    }
  })

  return (
    <mesh
      ref={setMeshRef}
      scale={scale}
      onPointerEnter={() => {
        if (meshRef?.material?.enableHoverEffects) {
          setIsHovered(true)
        }
      }}
      onPointerLeave={() => {
        if (meshRef?.material?.enableHoverEffects) {
          setIsHovered(false)
          setTargetPosition({ ...prevMousePosition })
        }
      }}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry />
      {/* @ts-ignore */}
      <customImageMaterial
        uFillColor={new THREE.Color(fillColor)}
        transparent={true}
        uTexture={texture}
        uPixels={PIXELS}
        uTextureSize={
          new THREE.Vector2(
            texture?.image?.width || 1,
            texture?.image?.height || 1
          )
        }
        uElementSize={
          new THREE.Vector2(
            texture?.image?.width || 1,
            texture?.image?.height || 1
          )
        }
        uProgress={0}
        uEffectType={uEffectType ?? 0}
        uMouse={new THREE.Vector2()}
        uPrevMouse={new THREE.Vector2()}
      />
    </mesh>
  )
}
