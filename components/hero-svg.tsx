export default function HeroSVG() {
  return (
    <svg
      viewBox="0 0 980 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="lg:w-[450px] w-full h-full"
      aria-hidden="true"
    >
      <g opacity="0.2">
        <path
          d="M30 420C200 360 260 190 430 180C650 165 710 360 950 300"
          stroke="url(#paint-linear)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8 14"
        />
        <path
          d="M40 260C180 220 260 70 420 80C600 92 700 230 930 190"
          stroke="url(#paint-linear)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 12"
        />
      </g>

      <g>
        <circle cx="120" cy="360" r="62" fill="url(#bubble-fill)" fillOpacity="0.55">
          <animate attributeName="cx" values="120;260;180;120" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cy" values="360;300;250;360" dur="18s" repeatCount="indefinite" />
          <animate attributeName="r" values="62;56;66;62" dur="18s" repeatCount="indefinite" />
        </circle>

        <circle cx="260" cy="250" r="38" fill="url(#bubble-fill)" fillOpacity="0.65">
          <animate attributeName="cx" values="260;420;360;260" dur="14s" begin="-2.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="250;210;170;250" dur="14s" begin="-2.5s" repeatCount="indefinite" />
        </circle>

        <circle cx="380" cy="390" r="74" fill="url(#bubble-fill)" fillOpacity="0.52">
          <animate attributeName="cx" values="380;560;500;380" dur="22s" begin="-6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="390;320;270;390" dur="22s" begin="-6s" repeatCount="indefinite" />
        </circle>

        <circle cx="560" cy="240" r="46" fill="url(#bubble-fill)" fillOpacity="0.58">
          <animate attributeName="cx" values="560;700;640;560" dur="16s" begin="-4s" repeatCount="indefinite" />
          <animate attributeName="cy" values="240;180;140;240" dur="16s" begin="-4s" repeatCount="indefinite" />
        </circle>

        <circle cx="700" cy="350" r="56" fill="url(#bubble-fill)" fillOpacity="0.5">
          <animate attributeName="cx" values="700;860;790;700" dur="19s" begin="-8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="350;290;240;350" dur="19s" begin="-8s" repeatCount="indefinite" />
          <animate attributeName="r" values="56;50;60;56" dur="19s" begin="-8s" repeatCount="indefinite" />
        </circle>
      </g>

      <g opacity="0.9">
        <circle cx="170" cy="150" r="8" fill="#27B173">
          <animate attributeName="cy" values="150;95;150" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="120" r="7" fill="#27B173">
          <animate attributeName="cy" values="120;70;120" dur="9s" begin="-3s" repeatCount="indefinite" />
        </circle>
        <circle cx="510" cy="160" r="9" fill="#27B173">
          <animate attributeName="cy" values="160;95;160" dur="11s" begin="-4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="760" cy="130" r="8" fill="#27B173">
          <animate attributeName="cy" values="130;75;130" dur="10.5s" begin="-6.1s" repeatCount="indefinite" />
        </circle>
      </g>

      <defs>
        <linearGradient
          id="paint-linear"
          x1="632"
          y1="66"
          x2="178"
          y2="703"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27b173" />
          <stop offset="0.619553" stopColor="#1a663f" />
          <stop offset="0.93102" stopColor="#26312d" />
        </linearGradient>

        <radialGradient
          id="bubble-fill"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(420 220) rotate(45) scale(520 420)"
        >
          <stop offset="0" stopColor="#33e092" />
          <stop offset="0.58" stopColor="#27b173" />
          <stop offset="1" stopColor="#1a663f" />
        </radialGradient>
      </defs>
    </svg>
  );
}
