interface DescriptionProps {
  text: string;
  kicker?: string;
}

export function Description({ text, kicker }: DescriptionProps) {
  return (
    <>
      {kicker && (
        <p
          style={{
            fontFamily: "var(--font-blender), monospace",
            fontWeight: 500,
            fontSize: 11,
            lineHeight: "16px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6b7280",
            margin: 0,
            marginBottom: 10,
          }}
        >
          {kicker}
        </p>
      )}
      <p
        style={{
          fontFamily: "var(--font-nunito), system-ui, \"Noto Sans TC\", \"PingFang TC\", \"Microsoft JhengHei\", sans-serif",
          fontWeight: 300,
          fontSize: 16,
          lineHeight: "28px",
          color: "#cfcfcf",
          margin: 0,
          marginBottom: 28,
          maxWidth: 400,
        }}
      >
        {text}
      </p>
    </>
  );
}
