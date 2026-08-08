"use client";

export default function RecordPlayer({
  image,
  spinning,
  className = "",
}: {
  image: string;
  spinning: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className="relative aspect-square w-56 rounded-full shadow-2xl md:w-64"
        style={{
          background:
            "repeating-radial-gradient(circle, #16140f 0px, #16140f 2px, #0d0c09 3px, #0d0c09 4px)",
          animation: "record-spin 3.2s linear infinite",
          animationPlayState: spinning ? "running" : "paused",
        }}
      >
        <div className="absolute inset-[18%] overflow-hidden rounded-full border-4 border-[#0d0c09] shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
      </div>

      <style>{`
        @keyframes record-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
