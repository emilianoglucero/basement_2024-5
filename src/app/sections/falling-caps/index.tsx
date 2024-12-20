'use client'

import React, { CSSProperties, useMemo, useRef } from 'react'

import { Container } from '~/components/layout/container'

import s from './caps.module.scss'
import { Cap } from './components/cap'
import { ASSETS } from '~/constants/assets'
import { shuffleArray } from './webgl-model'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { gsap } from '~/lib/gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

interface CapStyle {
  dom: CSSProperties & {
    transform: string
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  webgl: CSSProperties & {
    transform: string
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
}

export const FallingCaps = () => {
  const caps: CapStyle[] = [
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.85) rotate(-25deg)',
        top: '7%',
        left: '3%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.85) rotate(-12deg)',
        top: '7%',
        left: '3%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.75) rotate(-22deg)',
        top: '18%',
        right: '12%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.75) rotate(-12deg)',
        top: '18%',
        right: '20%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.55) rotate(-28deg)',
        bottom: '18%',
        right: '35%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.55) rotate(-14deg)',
        bottom: '18%',
        right: '35%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.65) rotate(22deg)',
        top: '2%',
        right: '2%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.65) rotate(10deg)',
        top: '2%',
        right: '2%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) rotate(22deg)',
        top: '10%',
        left: '35%'
      },
      webgl: {
        transform: 'translate(0, 0) rotate(8deg)',
        top: '10%',
        left: '35%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.7) rotate(27deg)',
        bottom: '7%',
        left: '1%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.7) rotate(11deg)',
        bottom: '7%',
        left: '1%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.72) rotate(22deg)',
        bottom: '1%',
        left: '18%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.72) rotate(-14deg)',
        bottom: '1%',
        left: '28%'
      }
    },
    {
      dom: {
        position: 'absolute',
        transform: 'translate(0, 0) scale(0.85) rotate(-8deg)',
        bottom: '1%',
        right: '1%'
      },
      webgl: {
        transform: 'translate(0, 0) scale(0.85) rotate(-12deg)',
        bottom: '4%',
        right: '1%'
      }
    }
  ]

  const randomIndices = useMemo(() => {
    const indices = Array.from({ length: caps.length }, (_, i) => i)
    return shuffleArray(indices)
  }, [])

  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return

    const title = titleRef.current
    const subtitle = subtitleRef.current
    const trigger = document.getElementById('caps-section')

    gsap.to(title, {
      y: 0,
      opacity: 1,
      ease: 'power4.out',
      duration: 2,
      scrollTrigger: {
        trigger: trigger,
        start: 'top+=45% bottom',
        end: 'bottom top'
      }
    })

    gsap.to(subtitle, {
      y: 0,
      opacity: 1,
      ease: 'power4.out',
      duration: 1.5,
      scrollTrigger: {
        trigger: trigger,
        start: 'top+=65% bottom',
        end: 'bottom top'
      }
    })
  }, [])

  return (
    <Container className={s.container} id="caps-section">
      <div className={s.textWrapper}>
        <h2>
          <strong ref={titleRef}>
            We want to help make <br />
            the internet <br />
          </strong>
          <span ref={subtitleRef}>everything it can be.</span>
        </h2>
      </div>
      {caps.map((cap, i) => (
        <Cap
          key={i}
          image={{ url: ASSETS.CAP.URL }}
          model={ASSETS.CAP.MODEL}
          index={randomIndices[i] ?? i}
          totalCaps={caps.length}
          webglStyle={cap.webgl}
          domStyle={cap.dom}
        />
      ))}
    </Container>
  )
}
