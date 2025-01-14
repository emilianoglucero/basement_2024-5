import { Float, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { EASE, gsap } from '~/lib/gsap'

gsap.registerPlugin(ScrollTrigger)

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
  const initialRotation = -0.15

  useIsomorphicLayoutEffect(() => {
    materials.m_Trophy3.transparent = true
    materials.m_Outline.transparent = true

    materials.m_Trophy3.opacity = 0
    materials.m_Outline.opacity = 0

    if (meshRef.current) {
      meshRef.current.scale.set(0.1, 0.1, 0.1)
      meshRef.current.rotation.set(0, initialRotation + 0.35, 0)
      meshRef.current.position.x = 4
    }

    const tl = gsap.timeline({
      ease: EASE
    })

    // trophy intro animation
    tl.to(meshRef.current.position, {
      x: 0,
      duration: 1.4,
      ease: 'power3.out'
    })
      .to(
        meshRef.current.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)'
        },
        '<0.1'
      )
      .to(
        meshRef.current.rotation,
        {
          y: initialRotation,
          duration: 1.6,
          ease: 'elastic.out(0.5, 0.3)',
          delay: 0.4
        },
        '<0.1'
      )
      .to(
        [materials.m_Trophy3, materials.m_Outline],
        {
          opacity: 1,
          duration: 1,
          stagger: 0.1
        },
        '<'
      )

    // trophy scroll rotation
    const scrollRotation = gsap.to(meshRef.current.rotation, {
      y: initialRotation + Math.PI * 3,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        immediateRender: false
      }
    })

    return () => {
      if (scrollRotation) {
        scrollRotation.kill()
      }
    }
  }, [materials, initialRotation])

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
