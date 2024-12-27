# Caps Section

The caps section is implemented in the `src/app/sections/falling-caps/index.tsx` file.

## Key Implementation Details

Is using the `Cap` component, which is a wrapper around the `WebGLModel` component.
The sticky scroll is implemented using the `StickyScrollScene` component from `r3f-scroll-rig` [`r3f-scroll-rig` powerups section](https://github.com/14islands/r3f-scroll-rig/tree/master/powerups)

### CSS Structure

1. **Outer Section**

   - Main outer section container with `position: relative` and total height of the section stored in `--falling-caps-section-height` css variable.

2. **Sticky Container for the subtitle text**

   - The text is children of the outer section. Uses `position: sticky`, 100vh height and is centered horizontally and vertically.

3. **Absolute positioned container for the caps**

   - I would like to use a div with position: sticky also for all the caps, but due to the use of extra divs that the `StickyScrollScene` implementation requires, the caps are positioned absolutely inside the container. Maybe there is a way to improve this.
   - Uses `position: absolute` with `top: 0` and `left: 0` to position the caps.

4. **Sticky Scroll Caps Container**

   - Inside the container there is a `div` with class name `stickyContainer` with `position: relative` and the height of the section.

5. **WebGLModel and Image**

   - Inside the relative div there is a `stickyContent` class name div with position sticky and 100vh height to position DOM images.
   - Also there is the `StickyScrollScene` component with the `WebGLModel` component as children.
   - The `Image` component in the `stickyContainer` div receives the dom css properties from the [caps data](../../../src/app/sections/falling-caps/caps-data.ts) and the `WebGLModel` in the `StickyScrollScene` component receives the webgl properties from the same file.

### Animation Timing

The sticky caps appear is animated with a GSAP timeline for each cap. Note: Maybe this can be improved and animated all the caps at the same time with a single timeline?
Uses the `calculateAnimationTimings` placed in the `src/app/sections/falling-caps/webgl-model/animation.ts` file to calculate the start and end positions for each cap.

```ts
const { startPosition, endPosition } = calculateAnimationTimings(
  index,
  totalCaps
)
```

```ts
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: trigger, // trigger is the outer section
    start: `top+=${startPosition * 100}% center`, // start position for the cap is calculated in the `calculateAnimationTimings` function
    end: `top+=${endPosition * 100}% center`, // end position for the cap is calculated in the `calculateAnimationTimings` function
    scrub: 1 // scrub is the scroll speed
  }
})
```

### Technical debt and improvements

- The caps are not animated all at the same time, but one by one. Investigate if it can be improved and animated all the caps at the same time with a single timeline.
