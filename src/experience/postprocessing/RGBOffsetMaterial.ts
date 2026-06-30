import * as THREE from "three";
import { POST } from "../config";
import { POST_VERTEX, RGB_OFFSET_FRAGMENT } from "./postShaders";

/**
 * Chromatic-aberration material (SCENE_SPEC §6b). Custom radial RGB-offset:
 * samples tDiffuse at three offsets 120 deg apart, scaled by a radial mask whose
 * sharp centre tracks `uRadialDumping.xy` (the projected focal point), then tints
 * by a warm `uTeint`. Always-on pass. depthTest/depthWrite off (fullscreen quad).
 */
export function createRGBOffsetMaterial(): THREE.ShaderMaterial {
  const { strength, radialDumping, teint } = POST.rgbOffset;
  return new THREE.ShaderMaterial({
    vertexShader: POST_VERTEX,
    fragmentShader: RGB_OFFSET_FRAGMENT,
    uniforms: {
      tDiffuse: { value: null },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uRadialDumping: {
        value: new THREE.Vector4(radialDumping[0], radialDumping[1], radialDumping[2], radialDumping[3]),
      },
      uStrength: { value: strength },
      uTeint: { value: new THREE.Vector3(teint[0], teint[1], teint[2]) },
    },
    depthTest: false,
    depthWrite: false,
  });
}
