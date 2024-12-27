# Smooth Scrolling Implementation

## Overview

The smooth scrolling implementation is implemented using the [`r3f-scroll-rig`](https://github.com/14islands/r3f-scroll-rig/tree/master) library, more precisely the `SmoothScrollbar` component, which integrates Lenis by default.

## Key Implementation Details

### Smooth Scrolling

The `SmoothScrollbar` component is implemented in the `src/components/three/canvas-provider.tsx` file.
We use the `config` prop to configure the Lenis options.

```tsx
<SmoothScrollbar
  config={{
    easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  }}
>
  // children
</SmoothScrollbar>
```

### Config Options

- `easing`: The current custom easing function is `(t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))`. It's an exponential ease-out function took from `https://easings.net/#easeOutExpo`. It was used to make the scrolling starts faster and decelerate smoothly.
- `direction: vertical`: The direction of the smooth scrolling.
- `smooth: true`: Enables smooth scrolling for desktop/mouse.
- `smoothTouch: false`: Disables smooth scrolling for touch devices.
