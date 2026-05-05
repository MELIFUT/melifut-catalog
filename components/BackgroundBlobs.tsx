"use client";

export default function BackgroundBlobs() {
  return (
    <>
      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 40px) scale(0.95); }
          66% { transform: translate(30px, -30px) scale(1.05); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 50px) scale(1.05); }
          66% { transform: translate(-40px, -30px) scale(0.95); }
        }
      `}</style>
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-red-500/20 blur-3xl"
          style={{ animation: "blob1 22s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-3xl"
          style={{ animation: "blob2 28s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-500/15 blur-3xl"
          style={{ animation: "blob3 35s ease-in-out infinite" }}
        />
      </div>
    </>
  );
}
