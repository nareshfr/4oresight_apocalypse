import React from 'react';

export default function RouteOverlay({
  activeRouteKey,
  routesData,
  isCompromised,
  currentSurvivorPos
}) {
  const currentRoute = routesData[activeRouteKey] || routesData.safest;
  const pathPoints = currentRoute.path || [];

  // Convert points array to SVG path string
  const createPathD = (pts) => {
    if (!pts || pts.length === 0) return '';
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  const pathD = createPathD(pathPoints);

  // Compromised blocked road segment
  const blockedSeg = routesData.compromised?.blockedSegment || { x1: 490, y1: 440, x2: 490, y2: 320 };
  const alternatePathD = createPathD(routesData.compromised?.alternatePath || []);

  const routeColor = activeRouteKey === 'safest' ? '#00f2fe' : '#f59e0b';
  const glowColor = activeRouteKey === 'safest' ? 'rgba(0, 242, 254, 0.4)' : 'rgba(245, 158, 11, 0.4)';

  return (
    <g id="tactical-routes-overlay">
      <defs>
        {/* Route Path Glow Filter */}
        <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="route-glow-danger" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Normal Active Route */}
      {!isCompromised ? (
        <g>
          {/* Underlay glow track */}
          <path
            d={pathD}
            fill="none"
            stroke={routeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.25"
            filter="url(#route-glow)"
          />

          {/* Solid base road path */}
          <path
            d={pathD}
            fill="none"
            stroke={routeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Animated moving tracer dashes (Tactical flight/ground vector effect) */}
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="8 16"
            strokeLinecap="round"
            className="animate-dash-flow"
            opacity="0.95"
          />

          {/* Waypoint nodes along the path */}
          {pathPoints.map((pt, idx) => (
            <g key={`wp-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle r="3" fill="#04080e" stroke={routeColor} strokeWidth="1.5" />
            </g>
          ))}
        </g>
      ) : (
        /* COMPROMISED ROUTE STATE */
        <g>
          {/* Blocked Road Segment in RED */}
          <line
            x1={blockedSeg.x1}
            y1={blockedSeg.y1}
            x2={blockedSeg.x2}
            y2={blockedSeg.y2}
            stroke="#ef4444"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#route-glow-danger)"
          />
          <line
            x1={blockedSeg.x1}
            y1={blockedSeg.y1}
            x2={blockedSeg.x2}
            y2={blockedSeg.y2}
            stroke="#fca5a5"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-dash-flow"
          />

          {/* Blocked Barrier Icon at center of compromised segment */}
          <g transform={`translate(${(blockedSeg.x1 + blockedSeg.x2) / 2}, ${(blockedSeg.y1 + blockedSeg.y2) / 2})`}>
            <rect
              x="-24"
              y="-12"
              width="48"
              height="24"
              rx="4"
              fill="#200606"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#ef4444"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="800"
            >
              BLOCKED
            </text>
          </g>

          {/* Detour Rerouted Path (Alternate route in dashed green/cyan) */}
          <path
            d={alternatePathD}
            fill="none"
            stroke="#0dd3ba"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-dash-flow"
            opacity="0.85"
          />

          {/* Reroute badge */}
          <g transform="translate(340, 240)">
            <rect
              x="-65"
              y="-11"
              width="130"
              height="22"
              rx="4"
              fill="#06222b"
              stroke="#0dd3ba"
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#5eead4"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              letterSpacing="0.06em"
            >
              DETOUR CORRIDOR +0.8 KM
            </text>
          </g>
        </g>
      )}
    </g>
  );
}
