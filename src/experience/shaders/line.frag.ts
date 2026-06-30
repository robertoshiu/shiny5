// Shared line FRAGMENT shader — VERBATIM from SCENE_SPEC.md §7d.
// Used by terrain, model reveal, and focus-distance materials.
// (uGridTexture is declared in the original but unused in the body.)
const lineFragment = /* glsl */ `
uniform sampler2D uGridTexture;   // declared but unused in body

varying vec3 vColor;
varying float vAlpha;

void main()
{
    gl_FragColor = vec4(vColor, vAlpha);
}
`;

export default lineFragment;
