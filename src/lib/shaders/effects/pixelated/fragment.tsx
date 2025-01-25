export const fragment = `
  uniform float uTime;
      uniform vec3 uFillColor;
      uniform float uProgress;
      uniform float uEffectType;
      uniform float uPixels[36];
      uniform vec2 uTextureSize;
      uniform vec2 uElementSize;
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uPrevMouse;
      varying vec2 vUv;
      vec3 blendNormal(vec3 base, vec3 blend) {
        return blend;
      }
      
      vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
        return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
      }
      float blendOverlay(float base, float blend) {
        return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
      }
      
      vec3 blendOverlay(vec3 base, vec3 blend) {
        return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
      }
      
      vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
        return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
      }
      float blendSubtract(float base, float blend) {
        return max(base+blend-1.0,0.0);
      }
      
      vec3 blendSubtract(vec3 base, vec3 blend) {
        return max(base+blend-vec3(1.0),vec3(0.0));
      }
      
      vec3 blendSubtract(vec3 base, vec3 blend, float opacity) {
        return (blendSubtract(base, blend) * opacity + base * (1.0 - opacity));
      }
      float hashwithoutsine12(vec2 p){
        vec3 p3  = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      //	Classic Perlin 2D Noise 
      //	by Stefan Gustavson
      //
      vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
      float cnoise(vec2 P){
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * 
          vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
      }
      
      
      
      
      float PristineGrid(vec2 uv, vec2 lineWidth){
        // lineWidth = clamp(lineWidth,0.,1.);
        vec4 uvDDXY = vec4(dFdx(uv), dFdy(uv));
        vec2 uvDeriv = vec2(length(uvDDXY.xz), length(uvDDXY.yw));
        bool invertLine = lineWidth.x > 0.5;
        vec2 targetWidth = invertLine ? vec2(1.0) - lineWidth : lineWidth;
        vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));
        vec2 lineAA = max(uvDeriv, 0.000001) * 5.5;
        vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);
        gridUV = invertLine ? gridUV : 1.0 - gridUV;
        vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
        grid2 *= clamp(targetWidth / drawWidth,0.,1.);
        grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - vec2(1.0),vec2(0.),vec2(1.)));
        grid2 = invertLine ? 1.0 - grid2 : grid2;
        return mix(grid2.x, 1.0, grid2.y);
      }
      
      float cubicOut(float t) {
        float f = t - 1.0;
        return f * f * f + 1.0;
      }
      float quadraticOut(float t) {
        return -t * (t - 2.0);
      }
      float cubicIn(float t) {
        return t * t * t;
      }
      float qinticIn(float t) {
        return pow(t, 4.0);
      }
      float map(float value, float min1, float max1, float min2, float max2) {
        float val = min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        return clamp(val, min2, max2);
      }
      float cubicInOut(float t) {
        return t < 0.5
          ? 4.0 * t * t * t
          : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
      }
      float quarticInOut(float t) {
        return t < 0.5
          ? +8.0 * pow(t, 4.0)
          : -8.0 * pow(t - 1.0, 4.0) + 1.0;
      }
      
      float quadraticInOut(float t) {
        float p = 2.0 * t * t;
        return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
      }
      float parabola( float x, float k ) {
        return pow( 4. * x * ( 1. - x ), k );
      }
      void main() {
        //  texture cover
        vec2 uv = vUv - vec2(0.5);
        float aspect1 = uTextureSize.x/uTextureSize.y;
        float aspect2 = uElementSize.x/uElementSize.y;
        if(aspect1>aspect2){uv *= vec2( aspect2/aspect1,1.);} 
        else{uv *= vec2( 1.,aspect1/aspect2);}
        uv += vec2(0.5);
        float uAspect = uElementSize.x/uElementSize.y;
        float imageAspect = uTextureSize.x/uTextureSize.y;

        vec4 defaultColor = texture2D(uTexture, uv);

        // horizontal transition
        if(uEffectType==0.){
          
          // pixelize
          float pixelateProgress = map(uProgress,0.3,1.,0.,1.);
          pixelateProgress = floor(pixelateProgress*12.)/12.;
          float s = floor(mix(11., 50.,quadraticOut(pixelateProgress)));
          vec2 gridSize = vec2(
            s, 
            floor(s/uAspect)
          );

          vec2 newUV = floor(vUv * gridSize) / gridSize + 0.5/vec2(gridSize);
          vec4 color = texture2D(uTexture, newUV);
          float finalProgress = map(uProgress,0.75,1.,0.,1.);
          color = mix(color, defaultColor, finalProgress);


          // grid lines
          vec2 multUV = fract(vUv * gridSize);
          float lines = PristineGrid(vUv * gridSize, vec2(0.2*(1.-uProgress)));


          // discard - slide in animation
          float discardProgress = map(uProgress,0.,0.8,0.,1.);
          if(vUv.x>cubicOut(discardProgress)) discard;


          // fill color
          vec3 fillColor = uFillColor;
          float gradWidth = mix(0.4,0.2,uProgress);
          float customProg = map(cubicInOut(uProgress), 0.0, 1., -gradWidth, 1. - gradWidth);
          float fillGradient = smoothstep(customProg, customProg+gradWidth, vUv.x);



          gl_FragColor.a = 1.;
          gl_FragColor.rgb = blendNormal(vec3(1.-lines),color.rgb , 0.9);
          gl_FragColor.rgb = mix( gl_FragColor.rgb,fillColor, fillGradient);
          gl_FragColor.rgb = mix( gl_FragColor.rgb,defaultColor.rgb, finalProgress);

        // vertical transition
        }else if(uEffectType==1.){

          float s = 120.;

          vec2 gridSize = vec2(
            s, 
            floor(s/uAspect)
          );

          vec2 newUV = floor(vUv * gridSize);

          float x = floor(vUv.x * 10.);
          float y = floor(vUv.y * 10.);
          float pattern = hashwithoutsine12(newUV);

          float w = 0.5;
          // float p0 = uProgress;

          float p0 = (clamp( (uProgress - 0.2*0.)/0.8,0.,1.));

          float p1 = (clamp( (uProgress - 0.2*1.)/0.8,0.,1.));


          p0  = map(p0, 0., 1., -w,  1.);
          p0 = smoothstep(p0,p0+w,1.-vUv.y);
          float p0_ = clamp(1. - 2.*p0 +pattern,0.,1.);



          p1  = map(p1, 0., 1., -w,  1.);
          p1 = smoothstep(p1,p1+w,1.-vUv.y);
          float p1_ = clamp(1. - 2.*p1 +pattern,0.,1.);


          
          vec3 finalColor = mix( uFillColor,defaultColor.rgb,p1_);

          gl_FragColor = vec4(vec3(p0_,p1_,0.),p0_);
          gl_FragColor = vec4(finalColor,p0_);
        }
          
        // end of transition

        // will be 0 until uProgress > 1
        float postEffectProgress = clamp(uProgress,0.0,1.0);

        // post transition effect
       if (postEffectProgress > 0.0) {
            // sets the grid size, each cell is x by y
            vec2 gridUV = floor(vUv * vec2(80.0, 80.0)) / vec2(80.0, 80.0);
            // sets the center of the cell
            vec2 centerOfPixel = gridUV + vec2(1.0/80.0, 1.0/80.0);

            vec2 mouseDirection = uMouse - uPrevMouse;
            vec2 pixelToMouseDirection = centerOfPixel - uMouse;
            float pixelDistanceToMouse = length(pixelToMouseDirection);
            // set the radius of the effect
            float strength = smoothstep(0.09, 0.2, pixelDistanceToMouse);

            vec2 uvOffset = strength * -mouseDirection * 10.4;
            vec2 distortedUV = vUv - uvOffset;

            vec4 distortedColor = texture2D(uTexture, distortedUV);
            
            // Blend between current color and distorted effect
            gl_FragColor.rgb = mix(gl_FragColor.rgb, distortedColor.rgb, postEffectProgress);
        }

        gl_FragColor.rgb = gl_FragColor.rgb;

      }
`
