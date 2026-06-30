"use client";

import { useEffect, useState, useCallback } from "react";
import type { SlideDetail, DetailBlock, I18n } from "@/content/detailTypes";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface Props {
  detail: SlideDetail;
  lang: "中" | "EN";
  onClose: () => void;
}

/* ── Bilingual helper ────────────────────────────────────────────────────── */

function tStr(s: I18n, lang: "中" | "EN"): string {
  return lang === "中" ? s.zh : (s.en || s.zh);
}

/* ── Shared sub-components ───────────────────────────────────────────────── */

function TagPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-blender), 'Arial Narrow', monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#05070f",
        background: "#ffe600",
        padding: "2px 7px",
        borderRadius: 2,
        textTransform: "uppercase" as const,
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
        lineHeight: 1.6,
      }}
    >
      {label}
    </span>
  );
}

/* ── Block renderers ─────────────────────────────────────────────────────── */

function StatsBlock({
  block,
  lang,
}: {
  block: Extract<DetailBlock, { kind: "stats" }>;
  lang: "中" | "EN";
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
        gap: 1,
        background: "rgba(255,230,0,0.07)",
      }}
    >
      {block.items.map((item, i) => (
        <div key={i} style={{ padding: "16px 18px", background: "#05070f" }}>
          <div
            style={{
              fontFamily: "var(--font-blender), 'Arial Narrow', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: "#ffe600",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#cfcfcf",
              marginTop: 5,
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              lineHeight: 1.4,
            }}
          >
            {tStr(item.label, lang)}
          </div>
          {item.sub && (
            <div
              style={{
                fontSize: 10,
                color: "#8e8e8e",
                marginTop: 3,
                lineHeight: 1.55,
              }}
            >
              {tStr(item.sub, lang)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TableBlock({
  block,
  lang,
}: {
  block: Extract<DetailBlock, { kind: "table" }>;
  lang: "中" | "EN";
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-blender), 'Arial Narrow', monospace",
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        <thead>
          <tr>
            {block.columns.map((col, i) => (
              <th
                key={i}
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  color: "#ffe600",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  borderBottom: "1px solid rgba(255,230,0,0.25)",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {tStr(col, lang)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                background:
                  ri % 2 === 0 ? "rgba(255,255,255,0.025)" : "transparent",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "7px 12px",
                    color: "#cfcfcf",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    verticalAlign: "top",
                  }}
                >
                  {tStr(cell, lang)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefsBlock({
  block,
  lang,
}: {
  block: Extract<DetailBlock, { kind: "defs" }>;
  lang: "中" | "EN";
}) {
  return (
    <div>
      {block.items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 14,
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ flexShrink: 0, width: 136 }}>
            <div
              style={{
                fontWeight: 600,
                color: "#ffffff",
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              {tStr(item.term, lang)}
            </div>
            {item.tag && (
              <div style={{ marginTop: 5 }}>
                <TagPill label={tStr(item.tag, lang)} />
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#8e8e8e",
              lineHeight: 1.65,
              flex: 1,
              minWidth: 0,
            }}
          >
            {tStr(item.desc, lang)}
          </div>
        </div>
      ))}
    </div>
  );
}

function CardsBlock({
  block,
  lang,
}: {
  block: Extract<DetailBlock, { kind: "cards" }>;
  lang: "中" | "EN";
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {block.items.map((item, i) => (
        <div
          key={i}
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 7,
              flexWrap: "wrap" as const,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#ffffff",
                lineHeight: 1.35,
              }}
            >
              {tStr(item.title, lang)}
            </span>
            {item.tag && <TagPill label={tStr(item.tag, lang)} />}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#8e8e8e",
              lineHeight: 1.65,
            }}
          >
            {tStr(item.body, lang)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListBlock({
  block,
  lang,
}: {
  block: Extract<DetailBlock, { kind: "list" }>;
  lang: "中" | "EN";
}) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {block.items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "6px 0",
            fontSize: 13,
            color: "#cfcfcf",
            lineHeight: 1.6,
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "block",
              width: 6,
              height: 6,
              background: "#ffe600",
              borderRadius: "50%",
              flexShrink: 0,
              marginTop: 6,
            }}
          />
          {tStr(item, lang)}
        </li>
      ))}
    </ul>
  );
}

function BlockRenderer({
  block,
  lang,
}: {
  block: DetailBlock;
  lang: "中" | "EN";
}) {
  switch (block.kind) {
    case "stats":
      return <StatsBlock block={block} lang={lang} />;
    case "table":
      return <TableBlock block={block} lang={lang} />;
    case "defs":
      return <DefsBlock block={block} lang={lang} />;
    case "cards":
      return <CardsBlock block={block} lang={lang} />;
    case "list":
      return <ListBlock block={block} lang={lang} />;
  }
}

/* ── InspectPanel ────────────────────────────────────────────────────────── */

export function InspectPanel({ detail, lang, onClose }: Props) {
  // First section open by default; others collapsed
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set([0])
  );

  // ESC key closes the panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggleSection = useCallback((i: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  // Prevent wheel events from propagating to the 3D slider beneath
  const stopWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      onWheel={stopWheel}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "min(640px, 62vw)",
        background: "rgba(5,7,15,0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,230,0,0.14)",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 40,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "var(--font-nunito), system-ui, 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(5,7,15,0.96)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "20px 24px 16px",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {detail.lede && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#8e8e8e",
                lineHeight: 1.65,
              }}
            >
              {tStr(detail.lede, lang)}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Close inspect panel (Escape)"
          style={{
            flexShrink: 0,
            background: "none",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            transition: "border-color 0.15s, color 0.15s",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#ffe600";
            e.currentTarget.style.color = "#ffe600";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid rgba(255,230,0,0.55)";
            e.currentTarget.style.outlineOffset = "2px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          ×
        </button>
      </div>

      {/* ── Accordion sections ───────────────────────────────────────────── */}
      <div style={{ flex: 1, paddingBottom: 48 }}>
        {detail.sections.map((section, i) => {
          const isOpen = openSections.has(i);

          return (
            <div
              key={i}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Accordion trigger */}
              <button
                role="button"
                aria-expanded={isOpen}
                aria-controls={`inspect-section-body-${i}`}
                id={`inspect-section-heading-${i}`}
                onClick={() => toggleSection(i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "15px 24px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline =
                    "2px solid rgba(255,230,0,0.45)";
                  e.currentTarget.style.outlineOffset = "-2px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
              >
                {/* Chevron arrow */}
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    width: 8,
                    height: 8,
                    flexShrink: 0,
                    marginTop: 5,
                    borderRight: "1.5px solid #ffe600",
                    borderBottom: "1.5px solid #ffe600",
                    transform: isOpen ? "rotate(-135deg)" : "rotate(45deg)",
                    transition: "transform 0.25s ease",
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-blender), 'Arial Narrow', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      color: isOpen ? "#ffe600" : "#ffffff",
                      transition: "color 0.2s ease",
                      lineHeight: 1.35,
                    }}
                  >
                    {tStr(section.heading, lang)}
                  </div>
                  {section.kicker && (
                    <div
                      style={{
                        fontFamily:
                          "var(--font-blender), 'Arial Narrow', monospace",
                        fontSize: 10,
                        color: "#8e8e8e",
                        letterSpacing: "0.12em",
                        marginTop: 3,
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {section.kicker}
                    </div>
                  )}
                </div>
              </button>

              {/* Collapsible content — CSS grid trick for smooth height animation */}
              <div
                id={`inspect-section-body-${i}`}
                role="region"
                aria-labelledby={`inspect-section-heading-${i}`}
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  opacity: isOpen ? 1 : 0,
                  transition:
                    "grid-template-rows 0.3s ease, opacity 0.25s ease",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div style={{ padding: "4px 24px 22px" }}>
                    <BlockRenderer block={section.block} lang={lang} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
