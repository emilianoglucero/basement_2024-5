import { styles, UseCanvas } from '@14islands/r3f-scroll-rig'
import { ScrollScene } from '@14islands/r3f-scroll-rig'
import { useScrollRig } from '@14islands/r3f-scroll-rig'
import Image from 'next/image'
import { Suspense, useEffect, useRef } from 'react'

import { ASSETS } from '~/constants/assets'

import AwwwardsTrophyModel from '../awwwward-trophy-model'
import { useAppStore } from '~/context/use-app-store'

export const AwwwardsTrophy = () => {
  const trackedElement = useRef<HTMLDivElement>(null!)
  const { hasSmoothScrollbar } = useScrollRig()
  const { setTrophyRef } = useAppStore()

  useEffect(() => {
    if (trackedElement.current) {
      setTrophyRef(trackedElement)
    }
  }, [trackedElement, setTrophyRef])

  return (
    <>
      <div ref={trackedElement} data-trophy>
        <Image
          alt={ASSETS.AWWWARDS.IMAGE.ALT}
          height={360}
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
              <Suspense fallback={null}>
                <AwwwardsTrophyModel
                  {...props}
                  model={ASSETS.AWWWARDS.MODEL_PATH}
                />
              </Suspense>
            )}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}
