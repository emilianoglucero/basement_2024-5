'use client'

import React, { CSSProperties } from 'react'

import { Container } from '~/components/layout/container'

import s from './caps.module.scss'
import { Cap } from './components/cap'
import { ASSETS } from '~/constants/assets'

interface CapStyle extends CSSProperties {
  transform: string
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export const FallingCaps = () => {
  const caps: CapStyle[] = [
    {
      transform: 'translate(0, 0) scale(0.85) rotate(-25deg)',
      top: '7%',
      left: '3%'
    },
    {
      transform: 'translate(0, 0) scale(0.75) rotate(-22deg)',
      top: '18%',
      right: '12%'
    },
    {
      transform: 'translate(0, 0) scale(0.55) rotate(-28deg)',
      bottom: '18%',
      right: '35%'
    },
    {
      transform: 'translate(0, 0) scale(0.65) rotate(22deg)',
      top: '2%',
      right: '2%'
    },
    {
      transform: 'translate(0, 0) rotate(22deg)',
      top: '10%',
      left: '35%'
    },
    {
      transform: 'translate(0, 0) scale(0.7) rotate(27deg)',
      bottom: '7%',
      left: '1%'
    },
    {
      transform: 'translate(0, 0) scale(0.72) rotate(22deg)',
      bottom: '1%',
      left: '18%'
    },
    {
      transform: 'translate(0, 0) scale(0.85) rotate(-8deg)',
      bottom: '1%',
      right: '1%'
    }
  ]
  return (
    <Container className={s.container}>
      <Cap
        image={{ url: ASSETS.CAP.URL, style: caps[0] }}
        model={ASSETS.CAP.MODEL}
      />
    </Container>
  )
}
