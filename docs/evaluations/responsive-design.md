# Devices optimization

### Trophy Model, Gallery and Footer WebGL Images

The trophy model, gallery and footer images position are calculated by the r3f-scroll-rig library, which are based on the image position.

The dynamic scaled based on the viewport size is also calculated by the r3f-scroll-rig library and based on the images size.

### Caps

The caps models are not based directly on the image size and position. The caps models have their own fixed size and position according to a viewport size calculations.
The utils.ts file contains helper functions like `convertCSSToWebGLPosition` and `calculateBaseScale` that are used to calculate the position and scale of the caps models based on the viewport size.

### Technical debt and improvements

- The current structure of the caps models is not based directly on the sticky images size and position. Should be refactored to incorporate caps models able to pin and scale based on the images size and position.
- The caps models are not scaling while the viewport is resizing. It should be fixed to scale while the browser is resizing.
