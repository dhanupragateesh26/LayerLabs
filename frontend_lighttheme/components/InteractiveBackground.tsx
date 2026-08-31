'use client';

export default function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#e8e4db]">
      {/* Vibrant animated colorful blobs */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-70 mix-blend-multiply animate-blob"
        style={{ background: '#c1ceb1' }} // Darker Sage  // c1ceb1
      />
      <div
        className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-70 mix-blend-multiply animate-blob animation-delay-2000"
        style={{ background: '#d4cbb8' }} // Darker Toasty Beige d4cbb8
      />
      <div
        className="absolute -bottom-[10%] left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-50 mix-blend-multiply animate-blob animation-delay-4000"
        style={{ background: '#b5a08a' }} // Deep Taupe Brown b5a08a
      />
      <div
        className="absolute bottom-[5%] -right-[5%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-60 mix-blend-multiply animate-blob animation-delay-6000"
        style={{ background: '#b8c8a1' }} // Deep Moss Green b8c8a1
      />

      {/* Subtle dot-grid pattern for texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Soft warm vignette to keep edges calm */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 10%, rgba(220,215,205,0) 20%, rgba(215,210,198,0.7) 100%)',
        }}
      />
    </div>
  );
}
