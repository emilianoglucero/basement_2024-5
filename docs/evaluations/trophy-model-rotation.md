# Trophy Model Rotation Implementation

The model rotation during the scroll logic is implemented in the `src/app/sections/hero/components/awwwward-trophy-model/index.tsx` file.

## Key Implementation Details

Is implemented in the `AwwwardsTrophyModel` component, using the `useFrame` hook to continuously update the model rotation based on the scroll position.

### Model Rotation

The model rotation is implemented calculating the target rotation based on the scroll position and then interpolating between the current rotation and the target rotation.

```tsx
useFrame(() => {
  if (meshRef.current) {
    // interpolate smoothly between current rotation and target rotation
    const targetRotation = initialRotation + scrollY * Math.PI * 10
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation,
      0.1
    )
  }
})
```

### How it Works

1. **Target Rotation Calculation**

   - `targetRotation = initialRotation + scrollY * Math.PI * 10`
   - `initialRotation` is the initial rotation of the model
   - `scrollY` is the normalized scroll position (0 to 1)
   - `Math.PI * 10` is the rotation speed
   - Results in approximately 5 full rotations during scroll

2. **Linear Interpolation (Lerp)**

   - `THREE.MathUtils.lerp(a, b, t)` calculates a value between `a` and `b` based on factor `t`
   - Formula: `a + (b - a) * t`
   - Where:
     - `a`: Current rotation (`meshRef.current.rotation.y`)
     - `b`: Target rotation (`targetRotation`)
     - `t`: Interpolation factor (`0.1`)

3. **Interpolation Factor (0.1)**

   - Small value (0.1) creates smooth movement
   - Each frame moves 10% of the remaining distance
   - Results in exponential deceleration
   - Higher values = faster rotation, less smoothing
   - Lower values = slower rotation, more smoothing

4. **Continuous Update**
   - Executed every frame via `useFrame`
   - Creates smooth transition between rotations
   - Never fully reaches target (asymptotic)
   - Maintains fluid motion during scroll
