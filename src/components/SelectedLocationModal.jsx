import React from 'react';
import { X, MapPin, AlertTriangle, Package, Check, Navigation, ArrowRight } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export default function SelectedLocationModal({ 
  location, 
  onClose, 
  onSetStop,
  onViewRoute,
  isCurrentStop 
}) {
  if (!location) return null;

  const handleSetStop = () => {
    audioSystem.playTacticalBeep(880, 0.08);
    if (onSetStop) onSetStop(location);
  };

  const handleViewRoute = () => {
    audioSystem.playRadarPing();
    if (onViewRoute) onViewRoute(location);
  };

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm px-4 pointer-events-auto animate-alert-slide">
      <div className="glass-panel tactical-corners p-4 border-cyan-500/40 bg-slate-950/95 shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
        
        {/* Top Header */}
        <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-tactical font-bold text-white tracking-wider flex items-center gap-1.5">
                <span>{location.name || location.shortName}</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400">
                {location.type}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audioSystem.playTacticalBeep(500, 0.04);
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tactical Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] font-mono">
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">DISTANCE:</span>
            <span className="text-white font-bold">{location.distance}</span>
            {location.detour && (
              <span className="text-slate-500 text-[9px] block">
                Detour: {location.detour}
              </span>
            )}
          </div>

          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">RISK FACTOR:</span>
            <span 
              className="font-bold flex items-center gap-1"
              style={{ color: location.riskColor || '#f59e0b' }}
            >
              <AlertTriangle className="w-3 h-3" />
              {location.risk || 'MEDIUM'}
            </span>
          </div>
        </div>

        {/* Available Resources */}
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 mb-3 text-xs font-mono">
          <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Package className="w-3 h-3 text-cyan-400" />
            <span>AVAILABLE RECOVERY SUPPLIES:</span>
          </div>
          <div className="text-slate-200 font-semibold flex items-center justify-between">
            <span>{location.available || 'Food +3, Water +2'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              UNCLAIMED
            </span>
          </div>
          {location.description && (
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              {location.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSetStop}
            className={`btn-tactical py-2 text-xs font-tactical tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
              isCurrentStop 
                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/60' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isCurrentStop ? 'STOP SET' : 'SET AS STOP'}</span>
          </button>

          <button
            onClick={handleViewRoute}
            className="btn-tactical btn-tactical-primary py-2 text-xs font-tactical tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-300" />
            <span>VIEW ROUTE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
