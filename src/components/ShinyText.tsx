export default function ShinyText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--foreground) 40%, var(--accent) 50%, var(--foreground) 60%)",
        backgroundSize: "250% 100%",
        animation: "shine 3.5s linear infinite",
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </span>
  );
}
