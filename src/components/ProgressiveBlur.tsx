export default function ProgressiveBlur({
  side,
  className = "",
}: {
  side: "left" | "right";
  className?: string;
}) {
  const layers = [1, 2, 3, 4];

  return (
    <div
      className={`pointer-events-none absolute top-0 z-20 h-full w-16 md:w-28 ${
        side === "left" ? "left-0" : "right-0"
      } ${className}`}
    >
      {layers.map((layer) => (
        <div
          key={layer}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer * 1.5}px)`,
            WebkitBackdropFilter: `blur(${layer * 1.5}px)`,
            maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, black ${
              25 * layer
            }%, transparent ${25 * (layer + 1)}%)`,
            WebkitMaskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, black ${
              25 * layer
            }%, transparent ${25 * (layer + 1)}%)`,
          }}
        />
      ))}
    </div>
  );
}
