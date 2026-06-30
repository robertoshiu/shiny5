// Global particles VERTEX shader — VERBATIM from SCENE_SPEC.md §7e.
const particlesVertex = /* glsl */ `
#define M_PI 3.1415926535897932384626433832795
uniform float uTime;
uniform float uWind;
varying float vAlpha;
highp float random(vec2 co) {
    highp float a = 12.9898; highp float b = 78.233; highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, M_PI);
    return fract(sin(sn) * c);
}
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x = mod(modelPosition.x + uTime * ((uWind * 0.5) + (uWind * 0.5) * random(modelPosition.yz)), 20.0) - 10.0;
    modelPosition.y = modelPosition.y + sin(modelPosition.x) * 0.3 + modelPosition.y + sin(modelPosition.x * 0.357) * 0.3;
    vec4 viewPosition = viewMatrix * modelPosition;
    float distance = distance(vec4(0.0), viewPosition);
    gl_PointSize = 1.5 - clamp((distance - 12.0) * 1.5, 0.0, 1.5);
    gl_Position = projectionMatrix * viewPosition;
    vAlpha = 1.0 - clamp(distance * 0.5 / 12.0, 0.0, 1.0);
}
`;

export default particlesVertex;
