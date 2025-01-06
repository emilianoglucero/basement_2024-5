import React from 'react'

import { Container } from '~/components/layout/container'
import { ASSETS } from '~/constants/assets'
import type { GalleryImage } from '~/ts/gallery'

import { GalleryItem } from './components/gallery-item'
import s from './gallery.module.scss'

export const Gallery = () => {
  const images: GalleryImage[] = [
    {
      url: ASSETS.GALLERY.IMAGES[0].URL,
      style: {
        gridArea: '1 / 1 / 1 / 13',
        viewportPorcentage: 100
      }
    },
    {
      url: ASSETS.GALLERY.IMAGES[1].URL,
      style: {
        gridArea: '2 / 1 / 3 / 9',
        viewportPorcentage: 66.67
      }
    },
    {
      url: ASSETS.GALLERY.IMAGES[2].URL,
      style: {
        gridArea: '2 / 9 / 3 / 13',
        viewportPorcentage: 33.33
      }
    }
  ]
  return (
    <Container as="section" className={s.container}>
      {images.map((image, index) => (
        <GalleryItem key={index} image={image} />
      ))}
    </Container>
  )
}
