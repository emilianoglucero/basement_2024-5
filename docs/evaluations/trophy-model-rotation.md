# Trophy Model Rotation Implementation

## Overview

The trophy model rotation during scroll is implemented using GSAP's ScrollTrigger plugin, it provides a smoother animation and more precise control over the rotation based on scroll position.

## Implementation Details

### Core Setup

The rotation logic is implemented in the AwwwardsTrophyModel component `src/app/sections/hero/components/awwwward-trophy-model/index.tsx` using GSAP ScrollTrigger:

```tsx
// trophy scroll rotation
const scrollRotation = gsap.to(meshRef.current.rotation, {
  y: initialRotation + Math.PI * 3,
  scrollTrigger: {
    trigger: 'body', // Trigger spans entire document length
    start: 'top top', // Start at the top of the document
    end: 'bottom bottom', // End at the bottom of the document
    scrub: 0.5, // Scrubbing with 0.5 delay
    immediateRender: false // Prevent initial rotation jump
})
```

### Key Components

1. **Initial State**

   - Model starts with an intitial timeline animation for intro
   - initialRotation value: -0.15 radians to slightly adjust the model for better visualisation

2. **Scroll Behavior**

   - Three radians of rotation plus initialRotation for target rotation which sets the speed. Rotation is distributed over the entire document length, this means the actual rotation speed depends on the document length
   - Scrubbing with 0.5 delay
   - ImmediateRender: false to prevent initial render and conflicts with the timeline

3. **Cleanup**
   - Proper ScrollTrigger cleanup on component unmount
   - Prevents memory leaks and animation conflicts

### Technical Debt and Improvements

- Consider setting a more limited section of the document to trigger the scroll rotation, this will reduce the CPU usage and can have a more precise control over the rotation.

### Improvements Over Previous Version

The GSAP ScrollTrigger implementation offers several advantages over the previous useFrame approach:

- Simplified codebase
- Smoother and more precise rotation transitions
- Reduced CPU usage compared to continuous frame updates and calculations
- Built-in cleanup and memory management
