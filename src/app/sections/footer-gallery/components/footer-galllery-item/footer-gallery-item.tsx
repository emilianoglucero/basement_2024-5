import Image from 'next/image'
import React, { useRef } from 'react'
import {
  ScrollScene,
  styles,
  UseCanvas,
  useScrollRig
} from '@14islands/r3f-scroll-rig'

import s from './footer-gallery-item.module.scss'
import { GalleryImage } from '~/ts/gallery'
import { WebGLImage } from '~/components/three/images/webgl-images/webgl-images'
import { ASSETS } from '~/constants/assets'

interface FooterGalleryItemProps {
  image: GalleryImage
}

export const FooterGalleryItem = ({ image }: FooterGalleryItemProps) => {
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
              <WebGLImage
                imgRef={imgRef}
                scrollState={scrollState}
                scale={scrollState.scale}
              />
            )}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}
