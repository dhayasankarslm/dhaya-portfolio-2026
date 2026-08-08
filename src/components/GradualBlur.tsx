export default function GradualBlur({
  position = "bottom",
  height = "6rem",
  strength = 2,
  divCount = 5,
}: {
  position?: "top" | "bottom" | "left" | "right";
  height?: string;
  strength?: number;
  divCount?: number;
}) {
  const layers = Array.from({ length: divCount }, (_, i) => i + 1);
  const isVertical = position === "top" || position === "bottom";
  const gradientDir =
    position === "bottom" ? "to top" : position === "top" ? "to bottom" : position === "left" ? "to right" : "to left";

  return (
    <div
      className={`pointer-events-none absolute z-20 ${
        isVertical ? "left-0 right-0" : "top-0 bottom-0"
      } ${position}-0`}
      style={isVertical ? { height } : { width: height }}
    >
      {layers.map((layer) => (
        <div
          key={layer}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer * strength}px)`,
            WebkitBackdropFilter: `blur(${layer * strength}px)`,
            maskImage: `linear-gradient(${gradientDir}, black ${(100 / divCount) * (layer - 1)}%, transparent ${(100 / divCount) * layer}%)`,
            WebkitMaskImage: `linear-gradient(${gradientDir}, black ${(100 / divCount) * (layer - 1)}%, transparent ${(100 / divCount) * layer}%)`,
          }}
        />
      ))}
    </div>
  );
}
