import { GLTF } from 'three-stdlib'
import * as THREE from 'three'

export interface GLTFResult extends GLTF {
  nodes: {
    Cube001: THREE.Mesh
    Cube001_1: THREE.Mesh
  }
  materials: {
    m_Trophy3: THREE.Material
    m_Outline: THREE.Material
  }
}
