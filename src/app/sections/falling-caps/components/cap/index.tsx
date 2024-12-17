import {
  ScrollScene,
  styles,
  UseCanvas,
  useScrollRig
} from '@14islands/r3f-scroll-rig'
import Image from 'next/image'
import { useRef } from 'react'
import s from './cap.module.scss'
import WebGLModel from '../../webgl-model'
import { ASSETS } from '~/constants/assets'

interface CapProps {
  image: { url: string; style: React.CSSProperties }
  model: any
}

export const Cap = ({ image, model }: CapProps) => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  const imgRef = useRef<HTMLImageElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()

  return (
    <>
      <div ref={trackedElement} className={s.capContainer} style={image.style}>
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
      {hasSmoothScrollbar && (
        <UseCanvas>
          <ScrollScene track={trackedElement}>
            {(props) => (
              <WebGLModel model={model} style={image.style} {...props} />
            )}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}
