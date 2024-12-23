'use client'

import { useState, Component, ErrorInfo, ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { CanvasProvider } from './canvas-provider'

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
    console.warn('[Canvas Error]', error, errorInfo)
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
    console.warn('[CanvasWrapper] Mounting canvas...')
    setIsMounted(true)
    return () => {
      console.warn('[CanvasWrapper] Unmounting canvas...')
    }
  }, [])

  if (!isMounted) {
    console.warn('[CanvasWrapper] Canvas not yet mounted')
    return <>{children}</>
  }

  console.warn('[CanvasWrapper] Canvas mounted successfully')
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
