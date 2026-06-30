import * as THREE from "three";
import { SLIDES, COLORS } from "../../config";
import { asset } from "@/lib/asset";
import { loadGlbEdges } from "../../resources/glbEdges";
import BaseScene from "./BaseScene";

/**
 * Slide 3 — INVESTIGATE (re-themed): a SEMICONDUCTOR PROCESS TOOL is the yellow
 * highlight (replacing the old mining drone), rendered as wireframe edge lines so
 * it keeps the "structural perspective grid" construction-drawing look. The grid
 * terrain + topography contour lines stay as the construction-line field.
 */
const EQUIPMENT = "cluster_tool"; // GLB under /assets/models/equipment

export default class InvestigateScene extends BaseScene {
  constructor(scene: THREE.Scene) {
    super(scene, SLIDES[3]);
  }

  protected build(): void {
    // Faint topography contour layers — construction lines on the grid.
    for (let i = 1; i <= 4; i++) {
      this.addModel({ file: `topography-${i}`, color: COLORS.grey18, role: "env" }, this.container);
    }

    // Yellow highlight: a real semiconductor tool GLB, converted to edge wireframe.
    loadGlbEdges(asset(`/assets/models/equipment/${EQUIPMENT}.glb`), {
      thresholdAngle: 35,
      targetSize: 14,
    })
      .then((geo) => this.addGeometry(geo, COLORS.accent, [0, 0, 0], this.container))
      .catch((err) => console.error("[equipment] load failed:", err));
  }
}
