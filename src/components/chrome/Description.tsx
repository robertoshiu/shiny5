interface DescriptionProps {
  text: string;
}

export function Description({ text }: DescriptionProps) {
  return (
    <p
      style={{
        fontFamily: "var(--font-nunito), system-ui, sans-serif",
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
  );
}
