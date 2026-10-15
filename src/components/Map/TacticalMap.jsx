import React, { useState, useRef } from 'react';
import { Plus, Minus, Compass, Maximize2, LocateFixed, Eye, EyeOff } from 'lucide-react';
import DangerZones from './DangerZones';
import RouteOverlay from './RouteOverlay';
import MapMarkers from './MapMarkers';
import { CITY_DISTRICTS } from '../../data/mockSurvivalData';
import { audioSystem } from '../../utils/audioSystem';

export default function TacticalMap({
  poiLocations,
  dangerZones,
  activeRouteKey,
  routesData,
  isCompromised,
  currentSurvivorPos,
  selectedLocationId,
  onSelectMarker,
  showThreatZones,
  onToggleThreatZones
}) {
  // Zoom & ViewBox State (Internal coordinate system: 1000 x 800)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const baseWidth = 1000;
  const baseHeight = 800;

  const currentWidth = baseWidth / zoom;
  const currentHeight = baseHeight / zoom;
  const minX = pan.x;
  const minY = pan.y;

  const viewBox = `${minX} ${minY} ${currentWidth} ${currentHeight}`;

  const handleZoomIn = () => {
    audioSystem.playTacticalBeep(800, 0.04);
    setZoom((prev) => Math.min(prev * 1.25, 2.8));
  };

  const handleZoomOut = () => {
    audioSystem.playTacticalBeep(650, 0.04);
    setZoom((prev) => Math.max(prev / 1.25, 0.75));
  };

  const handleResetView = () => {
    audioSystem.playTacticalBeep(700, 0.05);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFocusSurvivors = () => {
    audioSystem.playRadarPing();
    setZoom(1.4);
    setPan({
      x: currentSurvivorPos.x - (baseWidth / 1.4) / 2,
      y: currentSurvivorPos.y - (baseHeight / 1.4) / 2
    });
  };

  // Drag pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x) / zoom;
    const dy = (e.clientY - dragStart.current.y) / zoom;
    setPan({
      x: dragStart.current.panX - dx,
      y: dragStart.current.panY - dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden select-none bg-[#050b14]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* SVG Navigation Map Canvas */}
      <svg
        viewBox={viewBox}
        className="w-full h-full transition-transform duration-75"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Grid Pattern (Reference 3 dark background grid) */}
          <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="40" y2="0" stroke="#0e1b2e" strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="0" x2="0" y2="40" stroke="#0e1b2e" strokeWidth="0.8" opacity="0.6" />
          </pattern>

          {/* Diagonal Building Hatch */}
          <pattern id="bldg-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#12233a" strokeWidth="1.2" opacity="0.4" />
          </pattern>

          {/* River Water Gradient */}
          <linearGradient id="river-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#041824" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#072233" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#031520" stopOpacity="0.9" />
          </linearGradient>

          {/* Neon Road Arterial Glow */}
          <filter id="arterial-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Map Background & Grid */}
        <rect width="1000" height="800" fill="#060c16" />
        <rect width="1000" height="800" fill="url(#city-grid)" />

        {/* 2. City Districts / Building Blocks (Footprints) */}
        <g id="city-blocks" opacity="0.75">
          {/* District South West Blocks */}
          <rect x="80" y="580" width="100" height="70" rx="3" fill="#0a1526" stroke="#132640" strokeWidth="1" />
          <rect x="80" y="670" width="90" height="80" rx="3" fill="#091322" stroke="#132640" strokeWidth="1" />
          <rect x="250" y="610" width="80" height="90" rx="3" fill="#0a1526" stroke="#132640" strokeWidth="1" />

          {/* Central Commercial Blocks */}
          <rect x="250" y="470" width="80" height="60" rx="3" fill="#0d1b30" stroke="#152b47" strokeWidth="1" />
          <rect x="380" y="470" width="80" height="60" rx="3" fill="#0b172a" stroke="#152b47" strokeWidth="1" />
          <rect x="380" y="350" width="70" height="70" rx="3" fill="#0d1b30" stroke="#152b47" strokeWidth="1" />
          <rect x="260" y="350" width="80" height="60" rx="3" fill="#091322" stroke="#132640" strokeWidth="1" />

          {/* North Industrial Blocks */}
          <rect x="180" y="180" width="140" height="90" rx="4" fill="#091322" stroke="#162c4a" strokeWidth="1" />
          <rect x="350" y="170" width="100" height="90" rx="4" fill="#0b172a" stroke="#162c4a" strokeWidth="1" />
          <rect x="480" y="150" width="120" height="80" rx="4" fill="#0d1b30" stroke="#162c4a" strokeWidth="1" />

          {/* Sector 7 Downtown Blocks */}
          <rect x="520" y="330" width="110" height="80" rx="3" fill="#0d1b30" stroke="#193356" strokeWidth="1.2" />
          <rect x="520" y="440" width="70" height="80" rx="3" fill="#0a1526" stroke="#132640" strokeWidth="1" />
          <rect x="660" y="350" width="90" height="90" rx="3" fill="#0b172a" stroke="#152b47" strokeWidth="1" />

          {/* East Ridge Blocks */}
          <rect x="680" y="470" width="120" height="90" rx="3" fill="#091322" stroke="#132640" strokeWidth="1" />
          <rect x="710" y="160" width="100" height="80" rx="3" fill="#0a1526" stroke="#132640" strokeWidth="1" />
          <rect x="830" y="260" width="110" height="120" rx="4" fill="#091322" stroke="#132640" strokeWidth="1" />
          <rect x="830" y="410" width="120" height="110" rx="4" fill="#08101d" stroke="#132640" strokeWidth="1" />

          {/* Industrial Park Hatch Fill */}
          <rect x="185" y="185" width="130" height="80" fill="url(#bldg-hatch)" />
          <rect x="835" y="265" width="100" height="110" fill="url(#bldg-hatch)" />
        </g>

        {/* 3. River / Water Canal (Cutting diagonally through city as in Ref 3) */}
        <g id="city-river">
          {/* River Water Body */}
          <path
            d="M 60 410 Q 220 380, 420 460 T 780 620 L 880 790 L 760 800 Q 640 680, 380 530 T 40 470 Z"
            fill="url(#river-gradient)"
            stroke="#0dd3ba"
            strokeWidth="1.2"
            opacity="0.85"
          />
          {/* Shoreline water ripples */}
          <path
            d="M 60 410 Q 220 380, 420 460 T 780 620"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="1"
            strokeDasharray="8 6"
            opacity="0.4"
          />
          <path
            d="M 40 470 Q 380 530, 640 680 T 760 800"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="1"
            strokeDasharray="6 8"
            opacity="0.3"
          />
        </g>

        {/* 4. Secondary City Streets (Dark slate street network) */}
        <g id="secondary-streets" stroke="#17283e" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          {/* Horizontal Streets */}
          <line x1="60" y1="720" x2="940" y2="720" />
          <line x1="60" y1="640" x2="940" y2="640" />
          <line x1="60" y1="560" x2="940" y2="560" />
          <line x1="60" y1="440" x2="940" y2="440" />
          <line x1="60" y1="320" x2="940" y2="320" />
          <line x1="60" y1="220" x2="940" y2="220" />
          <line x1="60" y1="120" x2="940" y2="120" />

          {/* Vertical Streets */}
          <line x1="120" y1="60" x2="120" y2="760" />
          <line x1="220" y1="60" x2="220" y2="760" />
          <line x1="360" y1="60" x2="360" y2="760" />
          <line x1="490" y1="60" x2="490" y2="760" />
          <line x1="620" y1="60" x2="620" y2="760" />
          <line x1="740" y1="60" x2="740" y2="760" />
          <line x1="860" y1="60" x2="860" y2="760" />
        </g>

        {/* 5. Major Arterial Highways (Glowing Cyan/Teal as in Ref 3) */}
        <g id="major-arteries" strokeLinecap="round">
          {/* Main Diagonal Highway Expressway */}
          <line
            x1="120"
            y1="760"
            x2="860"
            y2="120"
            stroke="#0a2e42"
            strokeWidth="9"
            opacity="0.8"
          />
          <line
            x1="120"
            y1="760"
            x2="860"
            y2="120"
            stroke="#00c6ff"
            strokeWidth="3.2"
            filter="url(#arterial-glow)"
            opacity="0.75"
          />

          {/* Central Arterial Spine (West-East Avenue) */}
          <line
            x1="80"
            y1="440"
            x2="920"
            y2="440"
            stroke="#0a2e42"
            strokeWidth="8"
            opacity="0.7"
          />
          <line
            x1="80"
            y1="440"
            x2="920"
            y2="440"
            stroke="#0dd3ba"
            strokeWidth="2.8"
            filter="url(#arterial-glow)"
            opacity="0.7"
          />

          {/* North-South Boulevard 1 */}
          <line
            x1="360"
            y1="80"
            x2="360"
            y2="760"
            stroke="#0a2e42"
            strokeWidth="8"
            opacity="0.7"
          />
          <line
            x1="360"
            y1="80"
            x2="360"
            y2="760"
            stroke="#00f2fe"
            strokeWidth="2.5"
            opacity="0.65"
          />

          {/* North-South Boulevard 2 */}
          <line
            x1="670"
            y1="80"
            x2="670"
            y2="760"
            stroke="#0a2e42"
            strokeWidth="8"
            opacity="0.7"
          />
          <line
            x1="670"
            y1="80"
            x2="670"
            y2="760"
            stroke="#00f2fe"
            strokeWidth="2.5"
            opacity="0.65"
          />

          {/* River Bridges (Overpasses) */}
          <g stroke="#ffffff" strokeWidth="3" opacity="0.8">
            <line x1="210" y1="410" x2="230" y2="410" />
            <line x1="350" y1="460" x2="370" y2="460" />
            <line x1="480" y1="490" x2="500" y2="490" />
            <line x1="610" y1="570" x2="630" y2="570" />
          </g>
        </g>

        {/* 6. District Name Labels (Inspired by Reference 3 sleek typography) */}
        <g id="district-labels" pointerEvents="none">
          {CITY_DISTRICTS.map((district, idx) => (
            <text
              key={`dist-${idx}`}
              x={district.x}
              y={district.y}
              fill="#527092"
              fontSize="12"
              fontFamily="Rajdhani, sans-serif"
              fontWeight="700"
              letterSpacing="0.16em"
              opacity="0.8"
            >
              {district.name}
            </text>
          ))}
        </g>

        {/* 7. Active Calculated Routes Overlay */}
        <RouteOverlay
          activeRouteKey={activeRouteKey}
          routesData={routesData}
          isCompromised={isCompromised}
          currentSurvivorPos={currentSurvivorPos}
        />

        {/* 8. Zombie Danger Threat Zones (Toggled by state) */}
        {showThreatZones && (
          <DangerZones
            zones={dangerZones}
            isCompromised={isCompromised}
          />
        )}

        {/* 9. Interactive Map Markers */}
        <MapMarkers
          poiLocations={poiLocations}
          currentPosition={currentSurvivorPos}
          selectedLocationId={selectedLocationId}
          onSelectMarker={onSelectMarker}
        />

      </svg>

      {/* Floating Tactical Compass (Top Right - Reference 3 style) */}
      <div className="absolute top-16 right-4 z-20 pointer-events-auto flex flex-col items-center">
        <div 
          onClick={handleResetView}
          className="glass-panel p-2.5 rounded-full border-cyan-500/30 bg-slate-950/80 hover:border-cyan-400 text-cyan-400 cursor-pointer shadow-lg flex flex-col items-center justify-center group"
          title="Tactical North // Click to Reset View"
        >
          <span className="text-[10px] font-mono font-bold text-cyan-300 -mb-1">N</span>
          <Compass className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
        </div>
      </div>

      {/* Floating Zoom & Centering Controls (Bottom Right - Reference 3 style) */}
      <div className="absolute bottom-20 right-4 z-20 pointer-events-auto flex flex-col gap-1.5">
        <button
          onClick={handleFocusSurvivors}
          className="glass-panel p-2 rounded-lg border-cyan-500/30 bg-slate-950/85 hover:border-cyan-400 text-cyan-300 hover:text-white cursor-pointer shadow-lg transition-all"
          title="Focus on Survivors (Aarav & Mira)"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomIn}
          className="glass-panel p-2 rounded-lg border-slate-700 bg-slate-950/85 hover:border-cyan-400 text-slate-300 hover:text-white cursor-pointer shadow-lg transition-all"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="glass-panel p-2 rounded-lg border-slate-700 bg-slate-950/85 hover:border-cyan-400 text-slate-300 hover:text-white cursor-pointer shadow-lg transition-all"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="glass-panel p-2 rounded-lg border-slate-700 bg-slate-950/85 hover:border-cyan-400 text-slate-300 hover:text-white cursor-pointer shadow-lg transition-all"
          title="Reset Map Bounds"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Scale & Coordinate HUD Widget (Bottom Left of Map) */}
      <div className="absolute bottom-16 left-4 z-20 pointer-events-none hidden md:flex items-center gap-3 glass-panel px-3 py-1.5 border-slate-800 bg-slate-950/70 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>GRID: 1 KM / CELL</span>
        </span>
        <span className="text-slate-600">|</span>
        <span>LAT: 30.2672° N</span>
        <span className="text-slate-600">|</span>
        <span>LON: 97.7431° W</span>
        <span className="text-slate-600">|</span>
        <span className="text-cyan-400 font-bold">ZOOM: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
