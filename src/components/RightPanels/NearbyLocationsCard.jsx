import React from 'react';
import { MapPin, ShoppingBag, PlusSquare, Home, Shield, ChevronRight } from 'lucide-react';
import { audioSystem } from '../../utils/audioSystem';

export default function NearbyLocationsCard({ 
  locations, 
  selectedLocationId, 
  onSelectLocation 
}) {
  // Filter out start and beacon so it lists nearby points of interest
  const nearbyPoints = locations.filter(loc => !loc.isCurrent && !loc.isBeacon);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'store':
        return ShoppingBag;
      case 'pharmacy':
        return PlusSquare;
      case 'shelter':
        return Home;
      case 'cache':
        return Shield;
      default:
        return MapPin;
    }
  };

  const handleLocationClick = (loc) => {
    audioSystem.playTacticalBeep(750, 0.06);
    onSelectLocation(loc);
  };

  return (
    <div className="glass-panel p-3.5 border-slate-700/60 bg-slate-950/80 shadow-lg">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-tactical font-bold tracking-wider text-slate-200">
            NEARBY LOCATIONS
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          RADAR 2.0 KM
        </span>
      </div>

      {/* List of Nearby Locations */}
      <div className="space-y-1.5">
        {nearbyPoints.map((loc) => {
          const Icon = getCategoryIcon(loc.category);
          const isSelected = selectedLocationId === loc.id;

          return (
            <button
              key={loc.id}
              onClick={() => handleLocationClick(loc)}
              className={`w-full text-left p-2 rounded flex items-center justify-between transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500/60 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded ${
                  isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {loc.shortName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span>{loc.type}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span style={{ color: loc.riskColor }}>{loc.risk} Risk</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {loc.distance}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                  isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-500'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-500">
        <span>CLICK TO INSPECT POI</span>
        <span className="text-cyan-400">WAYPOINTS: MAPPED</span>
      </div>
    </div>
  );
}
