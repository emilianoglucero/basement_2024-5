import Image from 'next/image'
import { useRef } from 'react'

import { styles, UseCanvas } from '@14islands/r3f-scroll-rig'
import { ScrollScene } from '@14islands/r3f-scroll-rig'
import { useScrollRig } from '@14islands/r3f-scroll-rig'
import { ASSETS } from '~/constants/assets'
import AwwwardsTrophyModel from '../awwwward-trophy-model'

export const AwwwardsTrophy = () => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()

  return (
    <>
      <div ref={trackedElement}>
        <Image
          alt={ASSETS.AWWWARDS.IMAGE.ALT}
          height={360}
          priority
          quality={100}
          src={ASSETS.AWWWARDS.IMAGE.SRC}
          width={250}
          className={styles.hiddenWhenSmooth}
        />
      </div>
      {hasSmoothScrollbar && (
        <UseCanvas>
          <ScrollScene track={trackedElement}>
            {(props) => (
              <AwwwardsTrophyModel
                {...props}
                model={ASSETS.AWWWARDS.MODEL_PATH}
              />
            )}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}
