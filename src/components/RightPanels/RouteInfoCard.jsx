import React from 'react';
import { Route, Shield, Zap, AlertTriangle, Droplets, Clock, TrendingUp } from 'lucide-react';
import { audioSystem } from '../../utils/audioSystem';

export default function RouteInfoCard({ 
  activeRouteKey, 
  onSelectRoute, 
  routesData,
  isCompromised 
}) {
  const currentRoute = routesData[activeRouteKey] || routesData.safest;

  const handleTabChange = (key) => {
    audioSystem.playTacticalBeep(key === 'safest' ? 700 : 850, 0.08);
    onSelectRoute(key);
  };

  return (
    <div className={`glass-panel p-3.5 border-slate-700/60 bg-slate-950/80 shadow-lg ${
      isCompromised ? 'border-red-500/50 bg-red-950/20' : ''
    }`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-tactical font-bold tracking-wider text-slate-200">
            ROUTE INFORMATION
          </span>
        </div>
        {isCompromised ? (
          <span className="badge-tactical badge-red text-[9px] px-1.5 py-0.5 animate-pulse">
            COMPROMISED
          </span>
        ) : (
          <span className="text-[10px] font-mono text-cyan-400">
            PATH CALCULATED
          </span>
        )}
      </div>

      {/* Route Switcher Tabs: SAFEST vs FASTEST */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-lg border border-slate-800 mb-3">
        <button
          onClick={() => handleTabChange('safest')}
          className={`px-3 py-2 rounded text-xs font-tactical tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeRouteKey === 'safest'
              ? 'bg-gradient-to-r from-emerald-600/30 to-teal-500/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>SAFEST</span>
        </button>

        <button
          onClick={() => handleTabChange('fastest')}
          className={`px-3 py-2 rounded text-xs font-tactical tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeRouteKey === 'fastest'
              ? 'bg-gradient-to-r from-amber-600/30 to-orange-500/30 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>FASTEST</span>
        </button>
      </div>

      {/* Active Route Stats Display */}
      <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800 space-y-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentRoute.riskColor }}
            />
            <span>{currentRoute.name}</span>
          </div>
          <span className="text-sm font-mono font-bold text-white">
            {currentRoute.distance}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/70 text-[11px] font-mono">
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/50">
            <span className="text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Risk:
            </span>
            <span 
              className="font-bold"
              style={{ color: currentRoute.riskColor }}
            >
              {currentRoute.risk}
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/50">
            <span className="text-slate-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Water:
            </span>
            <span className="text-cyan-300 font-bold">
              {currentRoute.waterCost} Cost
            </span>
          </div>
        </div>

        {/* ETA & Description */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            ETA: {currentRoute.estimatedTime}
          </span>
          <span className="text-slate-500">
            WAYPOINTS: {currentRoute.path?.length || 8}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 font-sans italic pt-1 border-t border-slate-800/50">
          {currentRoute.description}
        </p>
      </div>

      {isCompromised && (
        <div className="p-2 rounded bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-300 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <span>
            SECTOR 4 BARRICADED: Active reroute algorithm engaged.
          </span>
        </div>
      )}
    </div>
  );
}
