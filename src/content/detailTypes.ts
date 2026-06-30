/**
 * Types for the per-slide "INSPECT" (近觀) drill-down detail content,
 * transplanted from the ShinyLogic (顯藝科技) shiny3 site's page tables/sections.
 * Rendered by src/components/chrome/InspectPanel.tsx as a collapsible accordion
 * over the focused-model background. Every string is bilingual (zh-Hant / en) so
 * the panel follows the EN / 中 language toggle.
 */

/** Bilingual string. `en` falls back to `zh` at render time if left empty. */
export type I18n = { zh: string; en: string };

/** One renderable block inside a section. */
export type DetailBlock =
  /** Big-number stat grid (e.g. ≤4hr / DR RTO). */
  | { kind: "stats"; items: { value: string; label: I18n; sub?: I18n }[] }
  /** Tabular data (e.g. the 6-layer × 4-phase delivery matrix). cells are bilingual. */
  | { kind: "table"; columns: I18n[]; rows: I18n[][] }
  /** Term → definition rows (e.g. L1–L6 layers, key facts, compliance standards). */
  | { kind: "defs"; items: { term: I18n; desc: I18n; tag?: I18n }[] }
  /** Card list (e.g. capability cards, solution blocks, open roles). */
  | { kind: "cards"; items: { title: I18n; body: I18n; tag?: I18n }[] }
  /** Simple bullet list (e.g. module names, template checklist). */
  | { kind: "list"; items: I18n[] };

/** A collapsible section in the inspect panel. */
export interface DetailSection {
  /** Section heading (the accordion row label). */
  heading: I18n;
  /** Optional short kicker shown under the heading (English mono label, e.g. "// FIG.03"). */
  kicker?: string;
  block: DetailBlock;
}

/** All drill-down content for one slide, keyed by its slug. */
export interface SlideDetail {
  slug: string;
  /** Optional one-line lede shown at the top of the panel. */
  lede?: I18n;
  sections: DetailSection[];
}
