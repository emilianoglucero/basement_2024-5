'use client'

import { useState } from 'react'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { CanvasProvider } from './canvas-provider'

export const CanvasWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    console.debug('[CanvasWrapper] Mounting canvas...')
    setIsMounted(true)
    return () => {
      console.debug('[CanvasWrapper] Unmounting canvas...')
    }
  }, [])

  if (!isMounted) {
    console.debug('[CanvasWrapper] Canvas not yet mounted')
    return <>{children}</>
  }

  console.debug('[CanvasWrapper] Canvas mounted successfully')
  return <CanvasProvider>{children}</CanvasProvider>
}
