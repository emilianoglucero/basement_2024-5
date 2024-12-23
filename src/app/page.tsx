'use client'
import React, { useRef } from 'react'

import { FallingCaps } from './sections/falling-caps'
import { FooterGallery } from './sections/footer-gallery'
import { Gallery } from './sections/gallery'
import { Hero } from './sections/hero'
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import '@14islands/r3f-scroll-rig/css'

const HomePage = () => {
  const eventSource = useRef<HTMLDivElement>(null!)

  return (
    <div ref={eventSource}>
      <GlobalCanvas
        eventSource={eventSource}
        eventPrefix="client"
        scaleMultiplier={0.01}
        camera={{ fov: 33 }}
        style={{ pointerEvents: 'none', zIndex: 100 }}
        debug={true}
      />
      <SmoothScrollbar
        config={{
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2
        }}
      >
        {(bind) => (
          <main {...bind}>
            <Hero />
            <Gallery />
            <FallingCaps />
            <FooterGallery />
          </main>
        )}
      </SmoothScrollbar>
    </div>
  )
}

export default HomePage
