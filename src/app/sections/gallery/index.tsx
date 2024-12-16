import React from 'react'

import { Container } from '~/components/layout/container'
import { GalleryItem } from './components/gallery-item'
import type { GalleryImage } from '~/ts/gallery'

import s from './gallery.module.scss'
import { ASSETS } from '~/constants/assets'

export const Gallery = () => {
  const images: GalleryImage[] = [
    {
      url: ASSETS.GALLERY.IMAGES[0].URL,
      style: {
        gridArea: '1 / 1 / 1 / 13'
      }
    },
    {
      url: ASSETS.GALLERY.IMAGES[1].URL,
      style: {
        gridArea: '2 / 1 / 3 / 9'
      }
    },
    {
      url: ASSETS.GALLERY.IMAGES[2].URL,
      style: {
        gridArea: '2 / 9 / 3 / 13'
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
