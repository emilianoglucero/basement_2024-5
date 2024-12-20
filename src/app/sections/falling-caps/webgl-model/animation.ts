export const calculateAnimationTimings = (index: number, totalCaps: number) => {
  const animationStart = 0.1
  const animationEnd = 0.9
  const animationSpace = animationEnd - animationStart
  const segmentSize = animationSpace / totalCaps

  return {
    startPosition: animationStart + index * segmentSize,
    endPosition: animationStart + (index + 1) * segmentSize
  }
}
