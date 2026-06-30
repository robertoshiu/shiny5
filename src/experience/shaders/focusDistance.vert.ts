// Focus-distance line VERTEX shader — VERBATIM from SCENE_SPEC.md §7c.
// Used by barrels floor / delimiter line art (distance-based fade). Paired with line.frag.
const focusDistanceVertex = /* glsl */ `
uniform vec3 uColor;

uniform vec3 uFocusPosition;
uniform vec2 uFocusDistance;

varying vec3 vColor;
varying float vAlpha;

void main()
{
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 cameraPosition = viewMatrix * worldPosition;

    float focusDistance = distance(vec3(position), uFocusPosition);
    focusDistance -= uFocusDistance.x;
    focusDistance /= uFocusDistance.y - uFocusDistance.x;
    focusDistance = 1.0 - clamp(focusDistance, 0.0, 1.0);

    vAlpha = focusDistance;
    vColor = uColor;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export default focusDistanceVertex;
