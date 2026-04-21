import { useId } from 'react';

/**
 * HearWithHeart — animated brand mark.
 *
 * Concept: a heart silhouette carved out of layered sonic waveforms with an
 * inner ear-spiral, an orbital particle ring, a soft aura halo, and a
 * light-sweep shimmer. Built from scoped SVG so multiple instances coexist.
 */
export default function LogoIcon({ size = 48, className = '' }) {
  const uid = useId().replace(/[:]/g, '');
  const id = (name) => `${name}-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="HearWithHeart logo"
    >
      <defs>
        {/* Main heart gradient (deep crimson → rose → coral) */}
        <linearGradient id={id('grad-main')} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor="#ff6b8a" />
          <stop offset="45%"  stopColor="#ef2b55" />
          <stop offset="100%" stopColor="#9f0824" />
        </linearGradient>

        {/* Shimmer highlight */}
        <linearGradient id={id('grad-shine')} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%"  stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="55%"  stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Aura glow */}
        <radialGradient id={id('grad-aura')} cx="50%" cy="55%" r="55%">
          <stop offset="0%"   stopColor="#ff4f74" stopOpacity="0.55" />
          <stop offset="60%"  stopColor="#ff4f74" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ff4f74" stopOpacity="0" />
        </radialGradient>

        {/* Wave stroke gradient */}
        <linearGradient id={id('grad-wave')} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ffb3c1" />
          <stop offset="100%" stopColor="#ff2d55" />
        </linearGradient>

        {/* Soft inner shadow / depth */}
        <filter id={id('soft')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>

        {/* Drop shadow for lift */}
        <filter id={id('lift')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#9f0824" floodOpacity="0.35" />
        </filter>

        {/* Heart mask — used to clip shine & inner waves inside the heart */}
        <clipPath id={id('heart-clip')}>
          <path d="M60 96 C28 76 14 58 14 40 C14 26 25 16 38 16 C48 16 55 22 60 30 C65 22 72 16 82 16 C95 16 106 26 106 40 C106 58 92 76 60 96 Z" />
        </clipPath>
      </defs>

      {/* Scoped animations */}
      <style>{`
        @keyframes hwh-spin-${uid}      { to   { transform: rotate(360deg); } }
        @keyframes hwh-spin-rev-${uid}  { to   { transform: rotate(-360deg); } }
        @keyframes hwh-beat-${uid} {
          0%, 100% { transform: scale(1); }
          14%      { transform: scale(1.08); }
          28%      { transform: scale(0.97); }
          42%      { transform: scale(1.05); }
          70%      { transform: scale(1); }
        }
        @keyframes hwh-pulse-${uid} {
          0%   { transform: scale(0.6); opacity: 0.9; }
          80%  { opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes hwh-shine-${uid} {
          0%   { transform: translateX(-120px) skewX(-18deg); }
          60%  { transform: translateX(140px)  skewX(-18deg); }
          100% { transform: translateX(140px)  skewX(-18deg); }
        }
        @keyframes hwh-wave-${uid} {
          0%, 100% { stroke-dashoffset: 0; opacity: 0.9; }
          50%      { stroke-dashoffset: 24; opacity: 0.55; }
        }
        @keyframes hwh-float-${uid} {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-1.2px); }
        }
        @keyframes hwh-glow-${uid} {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.85; }
        }

        .hwh-center-${uid}  { transform-box: fill-box; transform-origin: 50% 55%; }
        .hwh-orbit-${uid}   { transform-box: fill-box; transform-origin: 50% 50%; animation: hwh-spin-${uid} 14s linear infinite; }
        .hwh-orbit2-${uid}  { transform-box: fill-box; transform-origin: 50% 50%; animation: hwh-spin-rev-${uid} 22s linear infinite; }
        .hwh-beat-${uid}    { transform-box: fill-box; transform-origin: 50% 55%; animation: hwh-beat-${uid} 1.8s ease-in-out infinite; }
        .hwh-float-${uid}   { transform-box: fill-box; transform-origin: 50% 55%; animation: hwh-float-${uid} 3.6s ease-in-out infinite; }
        .hwh-pulse-${uid}   { transform-box: fill-box; transform-origin: 50% 55%; animation: hwh-pulse-${uid} 2.4s ease-out infinite; }
        .hwh-pulse2-${uid}  { transform-box: fill-box; transform-origin: 50% 55%; animation: hwh-pulse-${uid} 2.4s ease-out infinite; animation-delay: 1.2s; }
        .hwh-shine-${uid}   { animation: hwh-shine-${uid} 3.2s ease-in-out infinite; animation-delay: 0.8s; }
        .hwh-wave-${uid}    { stroke-dasharray: 6 4; animation: hwh-wave-${uid} 2.4s ease-in-out infinite; }
        .hwh-glow-${uid}    { animation: hwh-glow-${uid} 2.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hwh-orbit-${uid}, .hwh-orbit2-${uid}, .hwh-beat-${uid},
          .hwh-float-${uid}, .hwh-pulse-${uid}, .hwh-pulse2-${uid},
          .hwh-shine-${uid}, .hwh-wave-${uid}, .hwh-glow-${uid} {
            animation: none !important;
          }
        }
      `}</style>

      {/* Soft aura halo */}
      <circle cx="60" cy="62" r="54" fill={`url(#${id('grad-aura')})`} className={`hwh-glow-${uid}`} />

      {/* Expanding pulse rings (heartbeat echoes) */}
      <g className={`hwh-pulse-${uid}`} opacity="0.5">
        <path
          d="M60 96 C28 76 14 58 14 40 C14 26 25 16 38 16 C48 16 55 22 60 30 C65 22 72 16 82 16 C95 16 106 26 106 40 C106 58 92 76 60 96 Z"
          fill="none"
          stroke="#ff4f74"
          strokeWidth="1.4"
        />
      </g>
      <g className={`hwh-pulse2-${uid}`} opacity="0.35">
        <path
          d="M60 96 C28 76 14 58 14 40 C14 26 25 16 38 16 C48 16 55 22 60 30 C65 22 72 16 82 16 C95 16 106 26 106 40 C106 58 92 76 60 96 Z"
          fill="none"
          stroke="#ff4f74"
          strokeWidth="1.2"
        />
      </g>

      {/* Orbital rings with particles */}
      <g className={`hwh-orbit-${uid}`} opacity="0.55">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#ff4f74" strokeWidth="0.6" strokeDasharray="1 5" />
        <circle cx="60" cy="8"  r="1.8" fill="#ff2d55" />
        <circle cx="112" cy="60" r="1.3" fill="#ff6b8a" />
      </g>
      <g className={`hwh-orbit2-${uid}`} opacity="0.45">
        <circle cx="60" cy="60" r="46" fill="none" stroke="#ff6b8a" strokeWidth="0.5" strokeDasharray="0.8 4" />
        <circle cx="14" cy="60"  r="1.4" fill="#ff2d55" />
        <circle cx="60" cy="106" r="1.1" fill="#ffb3c1" />
      </g>

      {/* Heart body with beat animation */}
      <g className={`hwh-float-${uid}`}>
        <g className={`hwh-beat-${uid}`} filter={`url(#${id('lift')})`}>
          {/* Main heart */}
          <path
            d="M60 96 C28 76 14 58 14 40 C14 26 25 16 38 16 C48 16 55 22 60 30 C65 22 72 16 82 16 C95 16 106 26 106 40 C106 58 92 76 60 96 Z"
            fill={`url(#${id('grad-main')})`}
          />

          {/* Contents clipped to heart */}
          <g clipPath={`url(#${id('heart-clip')})`}>
            {/* Inner ear-spiral — evokes the cochlea / listening */}
            <g transform="translate(60 54)" opacity="0.95">
              <path
                d="M0 0 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M0 0 m-9 0 a9 9 0 1 1 18 0 a9 9 0 1 1 -18 0 M0 0 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.35"
              />
              {/* Signature swoop — stylised "listening" curl */}
              <path
                d="M-10 2 C -10 -8, 6 -10, 8 0 C 9 6, 2 8, -2 4"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="-2" cy="4" r="1.8" fill="#ffffff" />
            </g>

            {/* Layered soundwaves sweeping through the heart */}
            <g stroke={`url(#${id('grad-wave')})`} strokeLinecap="round" fill="none">
              <path className={`hwh-wave-${uid}`} d="M20 44 Q 40 34 60 44 T 100 44" strokeWidth="1.6" opacity="0.75" />
              <path className={`hwh-wave-${uid}`} d="M18 70 Q 40 60 60 70 T 104 70" strokeWidth="1.4" opacity="0.55" style={{ animationDelay: '0.4s' }} />
            </g>

            {/* Shimmer sweep */}
            <g className={`hwh-shine-${uid}`}>
              <rect x="-40" y="0" width="40" height="120" fill={`url(#${id('grad-shine')})`} />
            </g>
          </g>

          {/* Subtle rim-light on top edge */}
          <path
            d="M22 36 C28 22 44 20 52 28"
            stroke="#ffffff"
            strokeOpacity="0.45"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            filter={`url(#${id('soft')})`}
          />
          <path
            d="M68 28 C76 20 92 22 98 36"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            filter={`url(#${id('soft')})`}
          />
        </g>
      </g>
    </svg>
  );
}
