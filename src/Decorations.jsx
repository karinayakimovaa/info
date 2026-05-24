import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Decorations() {
  const container = useRef(null);
  const particles = Array.from({ length: 12 }, (_, index) => ({
    size: 4 + (index % 4) * 2,
    left: `${6 + index * 8}%`,
    top: `${12 + (index % 6) * 13}%`,
    opacity: 0.18 + (index % 3) * 0.08,
  }));

  const rings = [
    "absolute left-[8%] top-[40%] h-32 w-32 rounded-full border border-blue-500/20",
    "absolute right-[18%] top-[22%] h-20 w-20 rounded-full border border-sky-400/20",
    "absolute left-[18%] bottom-[16%] h-24 w-24 rounded-full border border-blue-300/20",
  ];

  const glowBlobs = [
    "absolute -left-20 top-[10%] h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]",
    "absolute bottom-[10%] right-[-60px] h-64 w-64 rounded-full bg-blue-600/10 blur-[120px]",
    "absolute left-[32%] top-[18%] h-52 w-52 rounded-full bg-sky-300/10 blur-[100px]",
    "absolute right-[22%] bottom-[18%] h-44 w-44 rounded-full bg-cyan-300/10 blur-[90px]",
    "absolute left-[12%] bottom-[6%] h-56 w-56 rounded-full bg-blue-200/12 blur-[130px]",
  ];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = gsap.utils.toArray(".decoration-float");

      items.forEach((el, index) => {
        gsap.to(el, {
          y: -20 - index * 5,
          duration: 4 + index,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.3,
        });
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'
    >
      {glowBlobs.map((className) => (
        <div key={className} className={`decoration-float ${className}`} />
      ))}

      {rings.map((className) => (
        <div key={className} className={`decoration-float ${className}`} />
      ))}

      <svg
        className='decoration-float absolute right-[-80px] top-[8%] w-[300px] opacity-20'
        viewBox='0 0 200 200'
        fill='none'
      >
        <path
          d='M20 100 Q100 20, 180 100'
          stroke='rgb(59,130,246)'
          strokeWidth='1'
        />
        <path
          d='M20 120 Q100 40, 180 120'
          stroke='rgb(59,130,246)'
          strokeWidth='0.6'
          strokeDasharray='4 6'
        />
      </svg>

      <svg
        className='decoration-float absolute left-[14%] top-[14%] w-[220px] opacity-[0.16]'
        viewBox='0 0 220 220'
        fill='none'
      >
        <path
          d='M18 146 C56 54, 154 42, 202 126'
          stroke='rgb(96,165,250)'
          strokeWidth='1'
        />
        <path
          d='M30 170 C82 88, 164 88, 196 148'
          stroke='rgb(125,211,252)'
          strokeWidth='0.8'
          strokeDasharray='5 8'
        />
      </svg>

      <div className='decoration-float absolute right-[8%] top-[45%] grid grid-cols-4 gap-2 opacity-30'>
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            className='h-1.5 w-1.5 rounded-full bg-blue-400'
          />
        ))}
      </div>

      <div className='decoration-float absolute left-[7%] top-[62%] grid grid-cols-5 gap-2 opacity-20'>
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className='h-1.5 w-1.5 rounded-full bg-sky-300'
          />
        ))}
      </div>

      <svg
        className='decoration-float absolute bottom-[10%] left-[-50px] w-[300px] opacity-20'
        viewBox='0 0 200 200'
        fill='none'
      >
        <path
          d='M0 100 Q50 50, 100 100 T200 100'
          stroke='rgb(59,130,246)'
          strokeWidth='1'
        />
      </svg>

      <svg
        className='decoration-float absolute bottom-[22%] right-[12%] w-[240px] opacity-[0.14]'
        viewBox='0 0 240 160'
        fill='none'
      >
        <path
          d='M4 88 C44 36, 88 36, 126 88 S208 140, 236 78'
          stroke='rgb(56,189,248)'
          strokeWidth='1'
        />
      </svg>

      <div className='decoration-float absolute left-[48%] top-[58%] h-[180px] w-[180px] rounded-full border border-white/20 bg-white/8 backdrop-blur-[2px]' />
      <div className='decoration-float absolute right-[28%] bottom-[26%] h-3 w-24 rounded-full bg-gradient-to-r from-transparent via-blue-300/30 to-transparent' />
      <div className='decoration-float absolute left-[26%] top-[28%] h-3 w-20 rounded-full bg-gradient-to-r from-transparent via-sky-300/35 to-transparent' />

      {particles.map((particle, index) => (
        <div
          key={index}
          className='decoration-float absolute rounded-full bg-blue-400/30'
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}
