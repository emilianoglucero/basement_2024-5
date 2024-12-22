import * as THREE from 'three'

import { basementOrange } from '~/lib/constants'

import { fragment } from './fragment'
import { vertex } from './vertex'
export const pixelatedlEffect = {
  uTime: 0,
  uFillColor: new THREE.Color(basementOrange),
  uProgress: 0,
  uPixels: null,
  uEffectType: 0,
  uTexture: null,
  uTextureSize: null,
  uElementSize: null,
  uMouse: new THREE.Vector2(),
  uPrevMouse: new THREE.Vector2(),
  vertex,
  fragment
}

export const PIXELS = [
  1, 1.5, 2, 2.5, 3, 1, 1.5, 2, 2.5, 3, 3.5, 4, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
  6, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 20, 100
].map((v) => v / 100)
