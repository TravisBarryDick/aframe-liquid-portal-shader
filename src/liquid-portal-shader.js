/**
 * This string template literal does not modify the input string, but allows us
 * to tag some strings as glsl snippets so that editors (e.g., VSCode) can
 * syntax higlight them.
 */
function glsl(strs) {
  return strs[0];
}

AFRAME.registerShader("liquid-portal", {
  schema: {
    timeMsec: { type: "time", is: "uniform" },
    src: { type: "map", is: "uniform" },

    rippleCenter: { type: "vec2", is: "uniform", default: { x: 0.5, y: 0.5 } },
    numRipples: { type: "float", is: "uniform", default: 5 },
    maxRippleOffset: { type: "float", is: "uniform", default: 0.01 },
    rippleSpeed: { type: "float", is: "uniform", default: 0.1 },

    twistRadius: { type: "float", is: "uniform", default: 0.25 },
    maxTwist: { type: "float", is: "uniform", default: 1.0 },

    strength: { type: "float", is: "uniform", default: 1.0 },
  },

  vertexShader: glsl`
    precision highp float;

    out vec2 v_uv;
    void main() {
      v_uv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: glsl`
    precision highp float;

    float PI = 3.14159;

    uniform sampler2D src;
    uniform float timeMsec;

    uniform vec2 rippleCenter;
    uniform float numRipples;
    uniform float maxRippleOffset;
    uniform float rippleSpeed;

    uniform float twistRadius;
    uniform float maxTwist;
    
    uniform float strength;

    in vec2 v_uv;

    // --- Polar Coordinates --- //

    vec2 toPolar(vec2 center, vec2 uv) {
      vec2 offset = uv - center;
      return vec2(atan(offset.x, offset.y), length(offset));
    }

    vec2 fromPolar(vec2 center, vec2 pc) {
      float angle = pc[0];
      float radius = pc[1];
      return vec2(center.x + sin(angle) * radius, center.y + cos(angle) * radius);
    }

    // --- Main --- //

    void main() {
      vec2 pc = toPolar(rippleCenter, v_uv);

      float r_offset = strength * maxRippleOffset * sin((pc[1] - timeMsec / 1000.0 * rippleSpeed) * 4.0 * PI * numRipples);

      float tr = strength * twistRadius;
      float mt = strength * maxTwist;
      float a_offset = pc[1] < tr ? mix(0.0, mt * 2.0 * PI, tr - pc[1]) : 0.0;

      pc[0] += a_offset;
      pc[1] += r_offset;

      vec2 uv = fromPolar(rippleCenter, pc);

      vec4 color_rgba = texture2D(src, uv);
      gl_FragColor = color_rgba;
    }
  `,
});
