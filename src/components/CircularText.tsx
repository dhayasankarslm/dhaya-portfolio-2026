export default function CircularText({
  text,
  className = "",
  center,
}: {
  text: string;
  className?: string;
  center?: React.ReactNode;
}) {
  const id = `circ-${text.replace(/\s+/g, "-")}`;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_10s_linear_infinite]">
        <defs>
          <path id={id} d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
        </defs>
        <text fill="var(--muted)" fontSize="13" letterSpacing="3">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      {center && (
        <div className="absolute inset-0 flex items-center justify-center">{center}</div>
      )}
    </div>
  );
}
