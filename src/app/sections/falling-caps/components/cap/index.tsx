import {
  styles,
  UseCanvas,
  useScrollRig,
  ScrollSceneChildProps
} from '@14islands/r3f-scroll-rig'
import Image from 'next/image'
import { useRef } from 'react'
import s from './cap.module.scss'
import WebGLModel from '../../webgl-model'
import { ASSETS } from '~/constants/assets'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'

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
    <section className={s.section}>
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
              <WebGLModel
                model={model}
                style={webglStyle ?? {}}
                index={index}
                totalCaps={totalCaps}
                {...props}
              />
            )}
          </StickyScrollScene>
        </UseCanvas>
      )}
    </section>
  )
}
