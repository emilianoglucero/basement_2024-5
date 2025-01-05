import {
  ScrollScene,
  styles,
  UseCanvas,
  useScrollRig
} from '@14islands/r3f-scroll-rig'
import Image from 'next/image'
import React, { Suspense, useRef } from 'react'

import { WebGLPixelatedImage } from '~/components/three/images/webgl-pixelated-image/webgl-pixelated-image'
import { ASSETS } from '~/constants/assets'
import { basementOrange } from '~/lib/constants'
import { GalleryImage } from '~/ts/gallery'

import s from './gallery-item.module.scss'

interface GalleryItemProps {
  image: GalleryImage
}

export const GalleryItem = ({ image }: GalleryItemProps) => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  const imgRef = useRef<HTMLImageElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()

  return (
    <>
      <div ref={trackedElement} className={s.container} style={image.style}>
        <Image
          alt={ASSETS.GALLERY.ALT}
          src={image.url}
          fill
          priority
          className={styles.hiddenWhenSmooth}
          onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
            imgRef.current = event.target as HTMLImageElement
          }}
        />
      </div>

      {hasSmoothScrollbar && (
        <UseCanvas>
          <ScrollScene track={trackedElement}>
            {(scrollState) => (
              <Suspense fallback={null}>
                <WebGLPixelatedImage
                  uEffectType={0}
                  imgRef={imgRef}
                  scale={scrollState.scale}
                  fillColor={basementOrange}
                  animation={{
                    duration: 2,
                    delay: 0.1,
                    hoverIntensity: 1.5,
                    hoverEaseFactor: 0.15,
                    mouseEaseFactor: 0.05
                  }}
                />
              </Suspense>
            )}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}
