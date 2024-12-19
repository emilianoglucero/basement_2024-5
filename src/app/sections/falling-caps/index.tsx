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
      transform: 'translate(0, 0) scale(0.85) rotate(-12deg)',
      top: '7%',
      left: '3%'
    },
    {
      transform: 'translate(0, 0) scale(0.75) rotate(-12deg)',
      top: '18%',
      right: '20%'
    },
    {
      transform: 'translate(0, 0) scale(0.55) rotate(-14deg)',
      bottom: '18%',
      right: '35%'
    },
    {
      transform: 'translate(0, 0) scale(0.65) rotate(10deg)',
      top: '2%',
      right: '2%'
    },
    {
      transform: 'translate(0, 0) rotate(8deg)',
      top: '10%',
      left: '35%'
    },
    {
      transform: 'translate(0, 0) scale(0.7) rotate(11deg)',
      bottom: '7%',
      left: '1%'
    },
    {
      transform: 'translate(0, 0) scale(0.72) rotate(-14deg)',
      bottom: '1%',
      left: '28%'
    },
    {
      transform: 'translate(0, 0) scale(0.85) rotate(-12deg)',
      bottom: '4%',
      right: '1%'
    }
  ]
  return (
    <Container className={s.container}>
      <div className={s.textWrapper}>
        <h2>
          We want to help make <br />
          the internet <br />
          <span>everything it can be.</span>
        </h2>
      </div>
      {caps.map((cap, index) => (
        <Cap
          key={index}
          image={{ url: ASSETS.CAP.URL, style: cap }}
          model={ASSETS.CAP.MODEL}
        />
      ))}
    </Container>
  )
}
