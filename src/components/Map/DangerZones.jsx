import React from 'react';

export default function DangerZones({ zones, isCompromised }) {
  return (
    <g id="tactical-danger-zones">
      <defs>
        {/* Heatmap Radial Gradients */}
        <radialGradient id="grad-critical" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="90%" stopColor="#b91c1c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="grad-high" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
          <stop offset="65%" stopColor="#ea580c" stopOpacity="0.18" />
          <stop offset="92%" stopColor="#c2410c" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="grad-medium" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#ca8a04" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="grad-low" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
          <stop offset="75%" stopColor="#0891b2" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>

        {/* Hazard Stripes Pattern for Compromised Blockades */}
        <pattern id="hazard-stripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#ef4444" strokeWidth="6" />
          <line x1="6" y1="0" x2="6" y2="12" stroke="#1f2937" strokeWidth="6" />
        </pattern>
      </defs>

      {zones.map((zone) => {
        let gradId = 'grad-medium';
        let strokeColor = '#eab308';
        if (zone.level === 'CRITICAL') {
          gradId = 'grad-critical';
          strokeColor = '#ef4444';
        } else if (zone.level === 'HIGH') {
          gradId = 'grad-high';
          strokeColor = '#f97316';
        } else if (zone.level === 'LOW') {
          gradId = 'grad-low';
          strokeColor = '#06b6d4';
        }

        return (
          <g key={zone.id} transform={`translate(${zone.x}, ${zone.y})`} className="cursor-pointer group">
            {/* Soft Heatmap Glow Circle */}
            <circle
              r={zone.radius}
              fill={`url(#${gradId})`}
              className="transition-all duration-700"
            />

            {/* Tactical Outer Perimeter Ring (Inspired by Drone UI in Reference 2) */}
            <circle
              r={zone.radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.65"
              className="animate-pulse-ring"
            />

            {/* Expanding Radar Ping Waves */}
            <circle
              r={zone.radius * 0.4}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values={`${zone.radius * 0.2};${zone.radius * 0.95}`}
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Center Core Dot */}
            <circle
              r="4.5"
              fill={strokeColor}
              opacity="0.9"
            />

            {/* Tactical Threat Badge / Curved Banner (Ref 2 Area of Patrol/Danger) */}
            <g transform={`translate(0, ${-zone.radius - 8})`}>
              <rect
                x="-58"
                y="-10"
                width="116"
                height="18"
                rx="3"
                fill="#0b1320"
                stroke={strokeColor}
                strokeWidth="1"
                opacity="0.9"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill={strokeColor}
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                {zone.name} &bull; {zone.level}
              </text>
            </g>

            {/* Hover Tooltip / Subtext */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" transform={`translate(0, ${zone.radius + 14})`}>
              <rect
                x="-70"
                y="-10"
                width="140"
                height="20"
                rx="3"
                fill="#050a12"
                stroke="#475569"
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {zone.swarmCount} &bull; {zone.density}
              </text>
            </g>
          </g>
        );
      })}

      {/* Compromised Hazard Danger Zone (Appears when route is compromised) */}
      {isCompromised && (
        <g transform="translate(490, 380)" className="animate-pulse">
          {/* Pulsing red ring */}
          <circle
            r="80"
            fill="url(#grad-critical)"
            opacity="0.6"
          />
          <circle
            r="80"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            className="animate-spin"
            style={{ transformOrigin: '490px 380px', animationDuration: '12s' }}
          />
          
          {/* Hazard Label */}
          <g transform="translate(0, -90)">
            <rect
              x="-80"
              y="-12"
              width="160"
              height="22"
              rx="4"
              fill="#250909"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill="#fca5a5"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="800"
              letterSpacing="0.1em"
            >
              ⚠ SECTOR 4 COLLAPSED
            </text>
          </g>
        </g>
      )}
    </g>
  );
}
