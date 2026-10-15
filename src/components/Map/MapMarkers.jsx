import React from 'react';
import { audioSystem } from '../../utils/audioSystem';

export default function MapMarkers({
  poiLocations,
  currentPosition,
  selectedLocationId,
  onSelectMarker
}) {
  const handleMarkerClick = (loc, e) => {
    e.stopPropagation();
    audioSystem.playTacticalBeep(840, 0.06);
    onSelectMarker(loc);
  };

  return (
    <g id="tactical-map-markers">
      <defs>
        {/* Glow Filters */}
        <filter id="marker-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="marker-glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="marker-glow-amber" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* POI Markers */}
      {poiLocations.map((loc) => {
        // Skip current position or render special marker
        if (loc.isCurrent) return null;

        const isSelected = selectedLocationId === loc.id;
        const isBeacon = loc.isBeacon;

        if (isBeacon) {
          // THE LAST BEACON MARKER (GREEN PULSING SANCTUARY)
          return (
            <g
              key={loc.id}
              transform={`translate(${loc.x}, ${loc.y})`}
              className="cursor-pointer group"
              onClick={(e) => handleMarkerClick(loc, e)}
            >
              {/* Radiating Beacon Broadcast Waves */}
              <circle r="16" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.8">
                <animate attributeName="r" values="14;64" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <circle r="16" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="14;64" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
              </circle>

              {/* Outer Protective Glow Ring */}
              <circle
                r="18"
                fill="rgba(16, 185, 129, 0.18)"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 3"
                className="animate-spin"
                style={{ animationDuration: '16s' }}
              />

              {/* Center Beacon Pillar */}
              <circle
                r="9"
                fill="#052e16"
                stroke="#34d399"
                strokeWidth="2.5"
                filter="url(#marker-glow-green)"
              />
              <circle r="4" fill="#6ee7b7" />

              {/* Antenna Spike */}
              <line x1="0" y1="-8" x2="0" y2="-18" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
              <circle cx="0" cy="-19" r="2" fill="#a7f3d0" />

              {/* Beacon Badge Tag */}
              <g transform="translate(0, -32)">
                <rect
                  x="-60"
                  y="-11"
                  width="120"
                  height="22"
                  rx="4"
                  fill="#032010"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  className="shadow-lg"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#34d399"
                  fontSize="10"
                  fontFamily="Rajdhani, sans-serif"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  ☢️ LAST BEACON &bull; 4.2 KM
                </text>
              </g>
            </g>
          );
        }

        // OTHER POIs: STORE (YELLOW/ORANGE), PHARMACY (CYAN/YELLOW), SHELTER (ORANGE), CACHE (ORANGE)
        let strokeColor = '#f59e0b';
        let fillColor = '#271904';
        let iconSymbol = '📦';

        if (loc.category === 'pharmacy') {
          strokeColor = '#0dd3ba';
          fillColor = '#042220';
          iconSymbol = '➕';
        } else if (loc.category === 'shelter') {
          strokeColor = '#f97316';
          fillColor = '#241005';
          iconSymbol = '⛺';
        } else if (loc.category === 'cache') {
          strokeColor = '#eab308';
          fillColor = '#251b04';
          iconSymbol = '🪂';
        } else if (loc.category === 'store') {
          strokeColor = '#f59e0b';
          fillColor = '#261704';
          iconSymbol = '🛒';
        }

        return (
          <g
            key={loc.id}
            transform={`translate(${loc.x}, ${loc.y})`}
            className="cursor-pointer group"
            onClick={(e) => handleMarkerClick(loc, e)}
          >
            {/* Selection Pulse Ring */}
            {isSelected && (
              <circle
                r="22"
                fill="none"
                stroke="#00f2fe"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-spin"
                style={{ animationDuration: '6s' }}
              />
            )}

            {/* Base Marker Shield */}
            <circle
              r="14"
              fill={fillColor}
              stroke={isSelected ? '#00f2fe' : strokeColor}
              strokeWidth={isSelected ? '2.5' : '1.8'}
              filter="url(#marker-glow-amber)"
              className="transition-all"
            />

            {/* Icon Text / Symbol */}
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontSize="11"
              fontFamily="sans-serif"
            >
              {iconSymbol}
            </text>

            {/* Floating Label */}
            <g transform="translate(0, -20)" className="transition-transform group-hover:scale-105">
              <rect
                x="-42"
                y="-9"
                width="84"
                height="18"
                rx="3"
                fill="#070e1a"
                stroke={isSelected ? '#00f2fe' : strokeColor}
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill={isSelected ? '#00f2fe' : '#f1f5f9'}
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
              >
                {loc.shortName}
              </text>
            </g>

            {/* Distance Tag */}
            <text
              x="0"
              y="23"
              textAnchor="middle"
              fill={strokeColor}
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
            >
              {loc.distance}
            </text>
          </g>
        );
      })}

      {/* CURRENT SURVIVOR POSITION (AARAV & MIRA) */}
      <g
        transform={`translate(${currentPosition.x}, ${currentPosition.y})`}
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          audioSystem.playRadarPing();
        }}
      >
        {/* Radar concentric pulse rings (Inspired by Reference 3) */}
        <circle r="18" fill="rgba(0, 242, 254, 0.12)" stroke="#00f2fe" strokeWidth="1" opacity="0.7">
          <animate attributeName="r" values="14;48" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* Tactical Crosshair / Aim Ring */}
        <circle
          r="16"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          className="animate-spin"
          style={{ animationDuration: '10s' }}
        />

        {/* Center Target Marker */}
        <circle
          r="9"
          fill="#06222b"
          stroke="#00f2fe"
          strokeWidth="2.5"
          filter="url(#marker-glow-cyan)"
        />
        <circle r="4" fill="#ffffff" />

        {/* Crosshair ticks */}
        <line x1="-14" y1="0" x2="-10" y2="0" stroke="#00f2fe" strokeWidth="2" />
        <line x1="10" y1="0" x2="14" y2="0" stroke="#00f2fe" strokeWidth="2" />
        <line x1="0" y1="-14" x2="0" y2="-10" stroke="#00f2fe" strokeWidth="2" />
        <line x1="0" y1="10" x2="0" y2="14" stroke="#00f2fe" strokeWidth="2" />

        {/* Survivor Team Tag */}
        <g transform="translate(0, -28)">
          <rect
            x="-60"
            y="-10"
            width="120"
            height="20"
            rx="4"
            fill="#031620"
            stroke="#00f2fe"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#67e8f9"
            fontSize="9.5"
            fontFamily="Rajdhani, sans-serif"
            fontWeight="700"
            letterSpacing="0.06em"
          >
            AARAV & MIRA &bull; READY
          </text>
        </g>
      </g>
    </g>
  );
}
