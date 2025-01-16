# Physics Implementation with @react-three/rapier

## Table of Contents

1. [Overview](#overview)
2. [Core Implementation](#core-implementation)
   - [Physics Setup](#physics-setup)
   - [State Management](#state-management)
   - [Force System](#force-system)
3. [Physics Behaviors](#physics-behaviors)
   - [RigidBody Configuration](#rigidbody-configuration)
   - [Force Application](#force-application)
   - [Movement Control](#movement-control)
   - [Pointer Interaction](#pointer-interaction)
4. [Performance & Optimization](#performance--optimization)
   - [Viewport Scaling](#viewport-scaling)
   - [Force Capping](#force-capping)
   - [Damping System](#damping-system)
5. [Integration with r3f-scroll-rig](#integration-with-r3f-scroll-rig)
   - [Challenges](#challenges)
   - [Solution](#solution)
   - [References](#references)
6. [Technical Debt and Improvements](#technical-debt-and-improvements)

## Overview

This implementation takes advantage of [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) to create realistic physics interactions for the Awwward trophy model. Key features include state-based physics behavior, force calculations, and rotation stabilization.

## Core Implementation

### Physics Setup

The physics world is configured in the CanvasProvider component with vertical gravity:

```tsx
<Physics gravity={[0, 2, 0]} colliders="cuboid">
  <Pointer size={0.5} />
  <AwwwardTrophyModel />
  {globalChildren}
</Physics>
```

### State Management

The trophy model uses two states for different physics behaviors:

- **Intro**: Initial movement towards target position
- **Active**: Continuous dynamic interaction

```tsx
const [animationState, setAnimationState] = useState<'intro' | 'active'>(
  'intro'
)
```

### Force System

Four main force constants control the physics behavior depending on the state:

```tsx
const INTRO_BASE_FORCE_MULTIPLIER = 30
const INTRO_MAX_FORCE = 50
const ACTIVE_BASE_FORCE_MULTIPLIER = 150
const ACTIVE_MAX_FORCE = 200
```

## Physics Behaviors

### RigidBody Configuration

RigidBody configuration for physics interactions:

```tsx
<RigidBody
    type="dynamic"
    colliders="cuboid"
    linearDamping={animationState === 'active' ? 40 : 20}
    angularDamping={15}
    enabledRotations={[true, true, true]}
>
```

### Force Application

1. **Intro State**:

   - Lower force multiplier for gentle initial movement
   - Transitions to active state when close to target

   ```tsx
        case 'intro': {
        currentPosition = ref.current.translation()
        vector3.set(currentPosition.x, currentPosition.y, currentPosition.z)

        // calculate direction and distance
        vector3.subVectors(targetPosition, currentPosition)
        distance = vector3.length()

        const introForceMagnitude = Math.min(
          distance * INTRO_BASE_FORCE_MULTIPLIER * viewportFactor,
          INTRO_MAX_FORCE * viewportFactor
        )
        ref.current.applyImpulse(
          vector3.normalize().multiplyScalar(introForceMagnitude),
          true
        )

        if (distance < 0.05) {
          setAnimationState('active')
        }
        break
      }
   ```

2. **Active State**:

   - Higher force multiplier for responsive movement
   - Includes rotation stabilization

   ```tsx
        case 'active': {
        currentPosition = ref.current.translation()
        vector3.set(currentPosition.x, currentPosition.y, currentPosition.z)

        // calculate direction and distance
        vector3.subVectors(targetPosition, currentPosition)
        distance = vector3.length()

        const forceMagnitude = Math.min(
          distance * ACTIVE_BASE_FORCE_MULTIPLIER * viewportFactor,
          ACTIVE_MAX_FORCE * viewportFactor
        )
        ref.current.applyImpulse(
          vector3.normalize().multiplyScalar(forceMagnitude),
          true
        )

        // stabilize the rotation
        angle.copy(ref.current.angvel())
        rotation.copy(ref.current.rotation())

        ref.current.setAngvel({
          x: angle.x - rotation.x * 3,
          y: angle.y - rotation.y * 3,
          z: angle.z - rotation.z * 3
        })

        break
      }
   ```

### Movement Control

Controls how the trophy moves in response to user interaction and scroll position:

```tsx
// Movement calculation
// In order to not interpolate the trophy with the gallery image when the user interacts with it, I added value in the z axis and add a small offset in the x axis
targetPosition.set(
  tracker.position.x - tracker.scale.y * 0.2, // adds a small offset to the x position to correct the position of the trophy
  tracker.position.y,
  tracker.position.z + tracker.scale.z // adds a small offset to the z position to place distance between the trophy and the gallery images
)
```

### Pointer Interaction

The pointer interaction is implemented using a Pointer component that follows the mouse position. The Pointer component is a kinematic rigid body that moves towards the mouse position.

```tsx
<Pointer size={0.5} />
```

## Performance & Optimization

### Viewport Scaling

Forces are scaled based on viewport size to provide a more consistent behavior across different screen sizes:

```tsx
const [viewportFactor, setViewportFactor] = useState(() =>
  calculateViewportFactor()
)

useEffect(() => {
  const handleResize = () => {
    setViewportFactor(calculateViewportFactor())
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

### Force Capping

Prevents unstable behavior through force limitations:

```typescript
const forceMagnitude = Math.min(
  distance * ACTIVE_BASE_FORCE_MULTIPLIER * viewportFactor,
  ACTIVE_MAX_FORCE * viewportFactor
)
```

### Damping System

Controls movement and rotation decay:

```typescript
linearDamping={animationState === 'active' ? 40 : 20}
angularDamping={15}
```

## Integration with r3f-scroll-rig

### Challenges

The integration between @react-three/rapier physics and r3f-scroll-rig presented a major challenge: the meshes and colliders were visually desynchronized.

### Reproduction of the issue (stackblitz playground links)

- [Issue with r3f-scroll-rig and rapier](https://stackblitz.com/edit/stackblitz-starters-cldat4za?file=app%2Fpage.tsx)
- [Working example without r3f-scroll-rig](https://stackblitz.com/edit/stackblitz-starters-rw7d3jhn?file=app%2Fpage.tsx)

### Solution

Thanks to guidance from r3f-scroll-rig maintainers, the key insights for successful integration were:

1. **Physics World Structure**

   - Physics scene should not be wrapped in the r3f-scroll-rig ScrollScene component
   - Instead, wrap canvas children directly in the physics world

   ```tsx
   <Physics gravity={[0, 2, 0]} colliders="cuboid">
     <Pointer size={0.5} />
     <AwwwardTrophyModel />
     {globalChildren}
   </Physics>
   ```

2. **Canvas children position**

   - Since we are not placing our canvas children in the ScrollScene component, we need to manually update their position
   - The solution I came up with to fix this was to use the useTracker hook from r3f-scroll-rig to get the position of the tracked element and update the position of the canvas children accordingly
   - The useTracker hook needs a ref of the tracked element and the options object to configure the tracker
   - [useTracker documentation](https://github.com/14islands/r3f-scroll-rig/blob/master/docs/api.md#usetracker)

   ```tsx
   const tracker = trophyRef
     ? useTracker(trophyRef, {
         rootMargin: '50%',
         threshold: 0,
         autoUpdate: true
       })
     : null
   ```

### References

- [GitHub Issue Discussion in r3f-scroll-rig GitHub](https://github.com/14islands/r3f-scroll-rig/issues/49)
- [Discord Discussion in pmdrs discord](https://discord.com/channels/740090768164651008/969941082144124959/1327341658584645652)

## Technical Debt and Improvements

1. **Performance Optimization**

   - Consider using fixed timestep for physics calculations
   - Implement physics sleep when trophy is at rest

2. **Code Structure**

   - Extract physics constants to configuration file
   - Create reusable physics components for similar behaviors

3. **Features**
   - Add visual collision effects. A reference that came to mind when playing with the physics is the short animated film [The Killing of an egg](https://youtu.be/8qTAHp_ERF4) by Paul Driessen where the characters talks while being hit.
   - Implement touch interaction support
   - Add physics-based sound effects
   - Implement physics interactions with the rest of the objects in the scene
