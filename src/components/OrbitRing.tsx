export default function OrbitRing({
  items,
  radius = 90,
  duration = 14,
  className = "",
}: {
  items: string[];
  radius?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          animation: `spin ${duration}s linear infinite`,
        }}
      >
        {items.map((item, i) => {
          const angle = (360 / items.length) * i;
          return (
            <span
              key={item}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-background text-[10px] uppercase"
              style={{
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              }}
            >
              {item}
            </span>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
