'use client'

import { useState, Component, ErrorInfo, ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { CanvasProvider } from './canvas-provider'
import { isDev } from '~/lib/constants'

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Canvas Error]', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })
  }

  render() {
    if (this.state.hasError) {
      return <div>Canvas Error. Check console.</div>
    }

    return this.props.children
  }
}

export const CanvasWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (isDev) console.debug('[CanvasWrapper] Mounting canvas...')
    setIsMounted(true)
    return () => {
      if (isDev) console.debug('[CanvasWrapper] Unmounting canvas...')
    }
  }, [])

  if (!isMounted) {
    if (isDev) console.debug('[CanvasWrapper] Canvas not yet mounted')
    return <>{children}</>
  }

  if (isDev) console.debug('[CanvasWrapper] Canvas mounted successfully')
  return <CanvasProvider>{children}</CanvasProvider>
}

export const SafeCanvasWrapper = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <CanvasErrorBoundary>
      <CanvasWrapper>{children}</CanvasWrapper>
    </CanvasErrorBoundary>
  )
}
