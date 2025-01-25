// import * as THREE from 'three'

// interface TransformValues {
//   scale: number
//   rotation: number
// }

// export const extractTransformValues = (transform: string): TransformValues => {
//   const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
//   const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/)

//   return {
//     scale: scaleMatch?.[1] ? parseFloat(scaleMatch[1]) : 1,
//     rotation: rotateMatch?.[1]
//       ? (-parseFloat(rotateMatch[1]) * Math.PI) / 180
//       : 0
//   }
// }

// export const convertCSSToWebGLPosition = (
//   style: React.CSSProperties
// ): [number, number, number] => {
//   let leftPercent = 0
//   if (style.left !== undefined) {
//     leftPercent = parseFloat(style.left?.toString() || '0')
//   } else if (style.right !== undefined) {
//     leftPercent = 100 - parseFloat(style.right?.toString() || '0')
//   }

//   let topPercent = 0
//   if (style.top !== undefined) {
//     topPercent = parseFloat(style.top?.toString() || '0')
//   } else if (style.bottom !== undefined) {
//     topPercent = 100 - parseFloat(style.bottom?.toString() || '0')
//   }

//   const aspect = window.innerWidth / window.innerHeight
//   const viewportHeight = 6 // adjust this value to control the overall scale
//   const viewportWidth = viewportHeight * aspect

//   const x = (leftPercent / 100) * viewportWidth - viewportWidth / 2
//   const y = viewportHeight / 2 - (topPercent / 100) * viewportHeight

//   return [x, y, 0]
// }

// export const calculateFinalScale = (
//   viewport: { width: number; height: number },
//   baseScale: number,
//   transformValues: TransformValues
// ): [number, number, number] => {
//   const viewportScale = Math.min(viewport.width, viewport.height) / 1000
//   const relativeScale = transformValues.scale * baseScale * viewportScale
//   return [relativeScale, relativeScale, relativeScale]
// }

// export const calculateBaseScale = (
//   scale: THREE.Vector3 | [number, number, number]
// ): number => {
//   return Array.isArray(scale)
//     ? Math.min(scale[0], scale[1])
//     : Math.min(scale.x, scale.y)
// }

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
