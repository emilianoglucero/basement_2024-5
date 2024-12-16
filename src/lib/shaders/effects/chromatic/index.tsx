import { vertex } from './vertex'
import { fragment } from './fragment'

export const chromaticEffect = {
  vertex,
  fragment,
  uniforms: {
    uTexture: { value: null },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uResolution: { value: [1, 1] },
    grayscale: { value: 0 },
    zoom: { value: 1 },
    opacity: { value: 1 }
  }
}
