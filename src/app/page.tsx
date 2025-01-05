'use client'

import { Suspense } from 'react'
import { FallingCaps } from './sections/falling-caps'
import { FooterGallery } from './sections/footer-gallery'
import { Gallery } from './sections/gallery'
import { Hero } from './sections/hero'

const HomePage = () => {
  return (
    <Suspense fallback={null}>
      <Hero />
      <Gallery />
      <FallingCaps />
      <FooterGallery />
    </Suspense>
  )
}

export default HomePage
