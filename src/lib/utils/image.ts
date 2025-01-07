// in sync with next.config.js (https://nextjs.org/docs/api-reference/next/image#device-sizes)
const imageWidths = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840
] as const

export type NextImageWidth = (typeof imageWidths)[number]

export const getNextImageSrc = ({
  src,
  width,
  quality = 75
}: {
  src: string
  width: NextImageWidth
  quality?: number
}) => {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

export const findClosestNextImageWidth = (width: number): NextImageWidth => {
  return (
    (imageWidths.find((w) => w >= width) ||
      imageWidths[imageWidths.length - 1]) ??
    3840
  )
}

export const getImageSizes = (
  desktopColumns: number,
  tabletColumns: number = desktopColumns,
  mobileColumns: number = desktopColumns,
  totalColumns: number = 12
): string => {
  const desktopPercentage = (desktopColumns / totalColumns) * 100
  const tabletPercentage = (tabletColumns / totalColumns) * 100
  const mobilePercentage = (mobileColumns / totalColumns) * 100

  return `(max-width: 768px) ${mobilePercentage}vw, (max-width: 1024px) ${tabletPercentage}vw, ${desktopPercentage}vw`
}
