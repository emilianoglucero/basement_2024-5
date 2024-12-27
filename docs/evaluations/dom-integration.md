# DOM to WebGL Integration Implementation

## Overview

The implementation tracks DOM elements and draws WebGL elements using the [`r3f-scroll-rig`](https://github.com/14islands/r3f-scroll-rig/tree/master) library.

## Key Implementation Details

### Position Tracking

The core functionality is implemented in `src/components/three/canvas-provider.tsx` creating a `CanvasProvider` wrapper component that sets up the Three.js `canvas` context and scroll integration using the `GlobalCanvas` component from `r3f-scroll-rig`.
Is implemented in the `src/app/layout.tsx` file to ensure that the `canvas` is mounted between page loads.

**Core Responsibilities**

```typescript
export function CanvasProvider({ children }: { children: React.ReactNode }) {
  // Provides WebGL context and scroll synchronization
  // Manages viewport updates and scroll events
  // Handles smooth scrolling integration
}
```

### From DOM to WebGL

We use the `useCanvas` hook from `r3f-scroll-rig` to tunnel the children to the GlobalCanvas.

```typescript
export function useCanvas({ children }: { children: React.ReactNode }) {
  // Tunnels children to the GlobalCanvas
}
```

Inside the `useCanvas` hook, we use the `ScrollScene` component from `r3f-scroll-rig` to track the position of the DOM elements and draw the WebGL elements.

```typescript
export function ScrollScene({ children }: { children: React.ReactNode }) {
  // Tracks position of DOM elements
  // Draws WebGL elements
  // Handles smooth scrolling integration
}
```

### Tunnel Images and Models

We place regular DOM images using the `Image` component from `next/image` and tunnel them to the WebGL context using the `useCanvas` hook. We use a ref to track the image and pass it to the `WebGLPixelatedImage` to render a plane geometry with the image texture or to the `WebGLModel` to render a 3D model.

```typescript
export function WebGLPixelatedImage({
  children
}: {
  children: React.ReactNode
}) {
  // Renders a plane geometry with the image texture
}
```

```typescript
export function WebGLModel({ children }: { children: React.ReactNode }) {
  // Renders a 3D model
}
```

### Fallback Implementation

For a better user experience, we fallback to the regular DOM elements on mobile devices using the `useDeviceDetect` hook and setting the `enabled` prop of the `SmoothScrollbar` component to `false`.
Using the conditional rendering with `hasSmoothScrollbar` we can check if the device has a smooth scrollbar and fallback to the regular DOM elements.
