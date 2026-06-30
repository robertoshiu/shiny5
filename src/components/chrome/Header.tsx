"use client";

import { HEADER_LABEL, MENU_LABEL } from "@/experience/config";

interface HeaderProps {
  menuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
}

function HamburgerIcon() {
  return (
    <svg
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="none"
      aria-hidden="true"
    >
      <rect y="0" width="22" height="1.5" fill="white" />
      <rect y="6" width="22" height="1.5" fill="white" />
      <rect y="12" width="22" height="1.5" fill="white" />
    </svg>
  );
}

/** Small Orano orbital mark SVG (mobile header logo) */
function OranoLogoMark({ size = 32 }: { size?: number }) {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
    >
      <circle cx={r} cy={r} r={r - 1.5} stroke="white" strokeWidth="1.4" />
      <ellipse
        cx={r}
        cy={r}
        rx={r - 1.5}
        ry={(r - 1.5) * 0.36}
        stroke="white"
        strokeWidth="1.1"
        transform={`rotate(-35 ${r} ${r})`}
      />
      <ellipse
        cx={r}
        cy={r}
        rx={r - 1.5}
        ry={(r - 1.5) * 0.36}
        stroke="white"
        strokeWidth="1.1"
        transform={`rotate(35 ${r} ${r})`}
      />
      <circle cx={r} cy={r} r="2" fill="white" />
    </svg>
  );
}

const labelFont: React.CSSProperties = {
  fontFamily: "var(--font-nunito), system-ui, sans-serif",
  fontWeight: 100,
  fontSize: 16,
  lineHeight: "40px",
  color: "#ffffff",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  whiteSpace: "nowrap",
};

export function Header({ menuOpen, onOpenMenu, onCloseMenu }: HeaderProps) {
  return (
    <>
      {/* ---- Top-left: yellow tick + label  (desktop only) ---- */}
      <div
        className="hidden md:flex items-center"
        style={{
          position: "fixed",
          top: 35,
          left: 55,
          gap: 12,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <span
          style={{
            display: "block",
            width: 3,
            height: 18,
            background: "#ffe600",
            flexShrink: 0,
          }}
        />
        <span style={labelFont}>{HEADER_LABEL}</span>
      </div>

      {/* ---- Top-left: Orano logo  (mobile only) ---- */}
      <div
        className="flex md:hidden items-center"
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          gap: 8,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <OranoLogoMark size={28} />
        <span
          style={{
            fontFamily: "var(--font-nunito), system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 16,
            letterSpacing: "0.1em",
            color: "#ffffff",
          }}
        >
          orano
        </span>
      </div>

      {/* ---- Top-right: menu trigger ---- */}
      <div
        className="flex items-center"
        style={{
          position: "fixed",
          top: 35,
          right: 45,
          gap: 14,
          pointerEvents: "auto",
          zIndex: 10,
          cursor: "pointer",
        }}
        role="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={menuOpen ? onCloseMenu : onOpenMenu}
      >
        {/* "LIVE THE EXPERIENCES" label — desktop only, hidden when menu open */}
        {!menuOpen && (
          <span style={labelFont} className="hidden md:inline">
            {MENU_LABEL}
          </span>
        )}

        {menuOpen ? (
          <span
            style={{
              ...labelFont,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            CLOSE
            {/* short horizontal connector between CLOSE and ✕ (see menu-open ref) */}
            <span
              aria-hidden
              style={{
                display: "block",
                width: 30,
                height: 1,
                background: "#ffffff",
              }}
            />
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>
              ✕
            </span>
          </span>
        ) : (
          <HamburgerIcon />
        )}
      </div>
    </>
  );
}
