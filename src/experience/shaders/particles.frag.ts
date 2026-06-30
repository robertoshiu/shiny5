// Global particles FRAGMENT shader — VERBATIM from SCENE_SPEC.md §7e.
const particlesFragment = /* glsl */ `
uniform vec3 uColor; uniform float uAlpha; varying float vAlpha;
void main() { gl_FragColor = vec4(uColor, vAlpha * uAlpha); }
`;

export default particlesFragment;
