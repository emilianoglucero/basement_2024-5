import {
  ScrollScene,
  styles,
  UseCanvas,
  useScrollRig
} from '@14islands/r3f-scroll-rig'
import Image from 'next/image'
import React, { Suspense, useRef, useState } from 'react'

import { WebGLPixelatedImage } from '~/components/three/images/webgl-pixelated-image/webgl-pixelated-image'
import { ASSETS } from '~/constants/assets'
import { basementOrange } from '~/lib/constants'
import { GalleryImage } from '~/ts/gallery'
import { getImageSizes } from '~/lib/utils/image'

import s from './footer-gallery-item.module.scss'

interface FooterGalleryItemProps {
  image: GalleryImage
}

export const FooterGalleryItem = ({ image }: FooterGalleryItemProps) => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  const imgRef = useRef<HTMLImageElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const sizes = getImageSizes(image.style.columns)

  return (
    <>
      <div ref={trackedElement} className={s.container} style={image.style}>
        <Image
          alt={ASSETS.GALLERY.ALT}
          src={image.url}
          fill
          sizes={sizes}
          className={styles.hiddenWhenSmooth}
          onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
            imgRef.current = event.target as HTMLImageElement
            setIsImageLoaded(true)
          }}
        />
      </div>

      {hasSmoothScrollbar && isImageLoaded && (
        <UseCanvas>
          <ScrollScene track={trackedElement}>
            {(scrollState) => {
              const trigger =
                document.getElementById('footer-gallery-section') || undefined
              return (
                <Suspense fallback={null}>
                  <WebGLPixelatedImage
                    imgRef={imgRef}
                    scale={scrollState.scale}
                    uEffectType={1}
                    fillColor={basementOrange}
                    animation={{
                      duration: 3,
                      delay: 0.2,
                      hoverIntensity: 1.5,
                      hoverEaseFactor: 0.15,
                      mouseEaseFactor: 0.05,
                      scroll: {
                        trigger: trigger,
                        start: 'bottom bottom',
                        end: 'bottom bottom'
                      }
                    }}
                  />
                </Suspense>
              )
            }}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}
