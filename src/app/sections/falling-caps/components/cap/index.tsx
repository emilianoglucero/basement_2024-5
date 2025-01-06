import {
  ScrollSceneChildProps,
  styles,
  UseCanvas,
  useScrollRig
} from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import Image from 'next/image'
import { Suspense, useRef } from 'react'

import { ASSETS } from '~/constants/assets'

import WebGLModel from '../../webgl-model'
import s from './cap.module.scss'

interface CapProps {
  image: { url: string }
  model: any
  index: number
  totalCaps: number
  webglStyle?: React.CSSProperties
  domStyle?: React.CSSProperties
}

export const Cap = ({
  image,
  model,
  index,
  totalCaps,
  webglStyle,
  domStyle
}: CapProps) => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  const imgRef = useRef<HTMLImageElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()

  return (
    <div className={s.section}>
      <div className={s.stickyContainer}>
        <div className={s.stickyContent} ref={trackedElement}>
          <Image
            alt={ASSETS.CAP.ALT}
            height={509}
            quality={100}
            src={image.url}
            width={509}
            className={styles.hiddenWhenSmooth}
            style={domStyle}
            onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
              imgRef.current = event.target as HTMLImageElement
            }}
          />
        </div>
      </div>
      {hasSmoothScrollbar && (
        <UseCanvas>
          <StickyScrollScene track={trackedElement}>
            {(props: ScrollSceneChildProps) => (
              <Suspense fallback={null}>
                <WebGLModel
                  model={model}
                  style={webglStyle ?? {}}
                  index={index}
                  totalCaps={totalCaps}
                  {...props}
                />
              </Suspense>
            )}
          </StickyScrollScene>
        </UseCanvas>
      )}
    </div>
  )
}
