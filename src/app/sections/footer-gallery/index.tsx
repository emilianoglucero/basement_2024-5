import React from 'react'

import { Container } from '~/components/layout/container'
import { ASSETS } from '~/constants/assets'
import type { GalleryImage } from '~/ts/gallery'

import { FooterGalleryItem } from './components/footer-galllery-item/footer-gallery-item'
import s from './footer-gallery.module.scss'

export const FooterGallery = () => {
  const images: GalleryImage[] = [
    {
      url: ASSETS.GALLERY.IMAGES[3].URL,
      style: {
        gridArea: '1 / 1 / 2 / 6',
        viewportPorcentage: 41.67
      }
    },
    {
      url: ASSETS.GALLERY.IMAGES[4].URL,
      style: {
        gridArea: '1 / 6 / 2 / 13',
        viewportPorcentage: 58.33
      }
    }
  ]
  return (
    <Container as="section" className={s.container} id="footer-gallery-section">
      {images.map((image, index) => (
        <FooterGalleryItem key={index} image={image} />
      ))}
    </Container>
  )
}
