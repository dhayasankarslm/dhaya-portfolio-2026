export default function BackgroundPhoto({
  src = "https://picsum.photos/id/29/2400/1600",
}: {
  src?: string;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden>
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(244,243,239,0.88) 0%, rgba(244,243,239,0.94) 40%, rgba(244,243,239,0.97) 100%)",
        }}
      />
    </div>
  );
}
