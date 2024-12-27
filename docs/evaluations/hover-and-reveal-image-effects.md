# Hover and Reveal Image Interaction

The hover and reveal image interaction is implemented in the `WebGLPixelatedImage` component in the `src/components/three/images/webgl-pixelated-image/webgl-pixelated-image.tsx` file. We use a custom shader to achieve a pixelated effect on hover and reveal.

## Key Implementation Details

### Shader Implementation

The shader is implemented in the `src/lib/shaders/effects/pixelated/index.tsx` file.
The list of uniforms values:

- `uEffectType`: `used to switch between two different reveal effects`
- `uFillColor`: `used to set the color of the reveal effect`
- `uProgress`: `used to set the progress value of the reveal effect`
- `uPixels`: `used to set the number of pixels per row and column`
- `uTexture`: `used to set the texture of the image`
- `uTextureSize`: `used to set the size of the texture`
- `uElementSize`: `used to set the size of the element`
- `uMouse`: `used to set the mouse position`
- `uPrevMouse`: `used to set the previous mouse position`

`PIXELS` is an array of 36 progressive values (ranging from 0.01 to 1.0) that define the pixelation density ratios used during the reveal animation. Lower values create more pixelation, while higher values result in clearer image rendering.

### Vertex Shader

The vertex shader is implemented in the `src/lib/shaders/effects/pixelated/vertex.tsx` file.
The vertex shader implementation is straightforward and handles the basic vertex transformations while passing UV coordinates to the fragment shader.

### Fragment Shader

The fragment shader is implemented in the `src/lib/shaders/effects/pixelated/fragment.tsx` file.
It implements two main reveal effects and a post-reveal interactive distortion:

1. **Horizontal Reveal (Effect Type 0)**

   - Creates a sliding reveal with dynamic pixelation
   - Combines grid lines, color gradient, and transitions
   - Progressively reduces pixelation as the image reveals

2. **Vertical Reveal (Effect Type 1)**

   - Uses procedural noise for a pattern-based reveal
   - Implements a vertical sweep with color blending
   - Creates an organic transition effect

3. **Post-Transition Interactive Hover Effect**
   - Tracks mouse movement for dynamic distortion
   - Creates a grid-based pixel displacement
   - Applies strength-based distortion based on mouse proximity

Key Uniforms:

- `uProgress`: Controls transition progress (0 to 1)
- `uEffectType`: Switches between transition types (0 or 1)
- `uMouse/uPrevMouse`: Mouse position for interactive effects
- `uPixels`: Array of pixel density values for transitions
- `uTextureSize/uElementSize`: Handles proper texture scaling
