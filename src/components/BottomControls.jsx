import React from 'react';
import { Shield, Zap, Footprints, AlertOctagon, RotateCcw, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export default function BottomControls({
  activeRouteKey,
  onSelectRoute,
  onContinueJourney,
  onSimulateEvent,
  isCompromised,
  onToggleCompromised,
  journeyStep,
  maxSteps,
  showThreatZones,
  onToggleThreatZones
}) {
  return (
    <footer className="fixed bottom-3 left-3 right-3 z-30 pointer-events-none flex justify-center">
      <div className="glass-panel tactical-corners pointer-events-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-cyan-500/30 bg-slate-950/90 shadow-[0_10px_35px_rgba(0,0,0,0.8)] max-w-4xl w-full">
        
        {/* Left Group: Route Selectors */}
        <div className="flex items-center gap-2">
          {/* SAFEST ROUTE */}
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(700, 0.06);
              onSelectRoute('safest');
            }}
            className={`btn-tactical py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer ${
              activeRouteKey === 'safest'
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>SAFEST ROUTE</span>
          </button>

          {/* FASTEST ROUTE */}
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(850, 0.06);
              onSelectRoute('fastest');
            }}
            className={`btn-tactical py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer ${
              activeRouteKey === 'fastest'
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>FASTEST ROUTE</span>
          </button>
        </div>

        {/* Center Group: Primary Action (CONTINUE JOURNEY) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(920, 0.09);
              onContinueJourney();
            }}
            className="btn-tactical btn-tactical-primary py-2 px-5 text-xs text-white font-tactical tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,242,254,0.35)]"
          >
            <Footprints className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>CONTINUE JOURNEY</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              STEP {journeyStep + 1}/{maxSteps}
            </span>
          </button>
        </div>

        {/* Right Group: Simulation & Hazards */}
        <div className="flex items-center gap-2">
          {/* SIMULATE EVENT */}
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(780, 0.07);
              onSimulateEvent();
            }}
            className="btn-tactical py-1.5 px-3 text-xs text-slate-200 hover:text-amber-300 hover:border-amber-500/50 flex items-center gap-1.5 cursor-pointer"
            title="Simulate a zombie horde or survival event"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>SIMULATE EVENT</span>
          </button>

          {/* TOGGLE COMPROMISED ROUTE */}
          <button
            onClick={() => {
              audioSystem.playAlert();
              onToggleCompromised();
            }}
            className={`btn-tactical py-1.5 px-2.5 text-xs flex items-center gap-1 cursor-pointer ${
              isCompromised
                ? 'btn-tactical-danger animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-red-400 border-slate-700'
            }`}
            title="Test Safe Route Compromised visual state"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isCompromised ? 'CLEAR HAZARD' : 'TEST COMPROMISE'}
            </span>
          </button>

          {/* Toggle Threat Zones Overlay */}
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(640, 0.04);
              onToggleThreatZones();
            }}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              showThreatZones 
                ? 'border-red-500/40 bg-red-950/40 text-red-300' 
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}
            title={showThreatZones ? "Hide Threat Zones" : "Show Threat Zones"}
          >
            {showThreatZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </footer>
  );
}
