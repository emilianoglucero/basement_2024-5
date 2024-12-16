export const fragment = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Get distorted UV coordinates
    vec2 uv = vUv;
    float distortion = uHover * 0.07;
    vec2 center = vec2(0.5);
    vec2 dir = uv - center;
    float dist = length(dir);
    vec2 offset = dir * (sin(dist * 8.0 - uTime) + 0.5) * distortion;
    vec2 distortedUv = uv + offset;

    // Chromatic aberration
    float r = texture2D(uTexture, distortedUv + vec2(0.01, 0.0) * uHover).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - vec2(0.01, 0.0) * uHover).b;
    vec3 color = vec3(r, g, b);

    // Add scanlines
    float scanline = sin(vUv.y * 200.0 + uTime * 5.0) * 0.1;
    color *= 1.0 - scanline * uHover;

    // Add noise
    float noise = random(vUv + uTime) * 0.1;
    color += noise * uHover;

    // Add vignette
    float vignette = length(dir) * 2.0;
    color *= 1.0 - vignette * 0.5 * uHover;

    gl_FragColor = vec4(color, 1.0);
  }
`
