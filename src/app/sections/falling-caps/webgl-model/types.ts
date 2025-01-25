import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

export interface GLTFResult extends GLTF {
  nodes: {
    Sphere007: THREE.Mesh
    Sphere007_1: THREE.Mesh
  }
  materials: {
    'm_Cap-v2': THREE.Material
    m_Outline: THREE.Material
  }
}

export interface Scale {
  scale: [number, number, number]
}

export interface WebGLModelProps {
  model: string
  scale: Scale
  style?: React.CSSProperties
  index: number
  totalCaps: number
}
