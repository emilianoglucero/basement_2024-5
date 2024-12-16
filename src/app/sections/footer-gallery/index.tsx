import React from 'react'

import { Container } from '~/components/layout/container'
import { FooterGalleryItem } from './components/footer-galllery-item/footer-gallery-item'
import type { GalleryImage } from '~/ts/gallery'

import s from './footer-gallery.module.scss'
import { ASSETS } from '~/constants/assets'

export const FooterGallery = () => {
  const images: GalleryImage[] = [
    {
      url: ASSETS.GALLERY.IMAGES[3].URL,
      style: {
        gridArea: '1 / 1 / 2 / 6'
      }
    },
    {
      url: ASSETS.GALLERY.IMAGES[4].URL,
      style: {
        gridArea: '1 / 6 / 2 / 13'
      }
    }
  ]
  return (
    <Container as="section" className={s.container}>
      {images.map((image, index) => (
        <FooterGalleryItem key={index} image={image} />
      ))}
    </Container>
  )
}
