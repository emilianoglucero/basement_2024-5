import { styles, UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import Image from 'next/image'
import { Suspense, useRef } from 'react'

import { ASSETS } from '~/constants/assets'

import WebGLModel from '../../webgl-model'
import s from './cap.module.scss'
import { Scale } from '../../webgl-model/types'
import { CapConfiguration } from '../../caps-data'

interface CapProps {
  image: { url: string }
  model: any
  index: number
  totalCaps: number
  domDisplayStyle?: React.CSSProperties
  domPositionStyle?: React.CSSProperties
  webglProperties?: CapConfiguration['webglProperties']
}

export const Cap = ({
  image,
  model,
  index,
  totalCaps,
  domPositionStyle,
  domDisplayStyle,
  webglProperties
}: CapProps) => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  // I'm not using imgRef, DELETE
  // const imgRef = useRef<HTMLImageElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()

  return (
    <div className={s.section} style={domPositionStyle}>
      <div className={s.stickyContainer}>
        <div
          className={s.stickyContent}
          ref={trackedElement}
          style={domDisplayStyle}
        >
          <Image
            alt={ASSETS.CAP.ALT}
            height={509}
            quality={100}
            src={image.url}
            width={509}
            className={styles.hiddenWhenSmooth}
            // style={{
            //   width: '100%',
            //   height: '100%'
            // }}
            // style={domStyle}
            // DELETE
            // onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
            //   imgRef.current = event.target as HTMLImageElement
            // }}
          />
        </div>
      </div>
      {hasSmoothScrollbar && (
        <UseCanvas>
          <StickyScrollScene track={trackedElement}>
            {(scale: Scale) => (
              <Suspense fallback={null}>
                <WebGLModel
                  model={model}
                  style={webglProperties ?? {}}
                  index={index}
                  totalCaps={totalCaps}
                  scale={scale}
                />
              </Suspense>
            )}
          </StickyScrollScene>
        </UseCanvas>
      )}
    </div>
  )
}
