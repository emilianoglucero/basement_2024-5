import { styles, UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig'
import Image from 'next/image'
import { useRef } from 'react'
import s from './cap.module.scss'
import WebGLModel from '../../webgl-model'
import { ASSETS } from '~/constants/assets'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'

interface CapProps {
  image: { url: string; style: React.CSSProperties }
  model: any
}

export const Cap = ({ image, model }: CapProps) => {
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
            onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
              imgRef.current = event.target as HTMLImageElement
            }}
          />
        </div>
      </div>
      {hasSmoothScrollbar && (
        <UseCanvas>
          <StickyScrollScene track={trackedElement}>
            {(props) => (
              <WebGLModel model={model} style={image.style} {...props} />
            )}
          </StickyScrollScene>
        </UseCanvas>
      )}
    </section>
  )
}
