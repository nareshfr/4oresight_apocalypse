import React from 'react';
import { Target, Radio, Compass, Signal, CheckCircle2 } from 'lucide-react';
import { audioSystem } from '../../utils/audioSystem';

export default function ObjectiveCard({ 
  objective, 
  onSignalCycle 
}) {
  const { 
    title = 'Reach The Last Beacon',
    distanceKm = 4.2,
    currentStep = 'Find a safe route',
    beaconSignal = 'Medium',
    beaconFreq = '142.85 MHz'
  } = objective;

  // Signal level bars: Weak (1), Medium (2), Strong (3)
  const signalLevels = {
    Weak: 1,
    Medium: 2,
    Strong: 3
  };
  const activeLevel = signalLevels[beaconSignal] || 2;

  const cycleSignal = () => {
    const states = ['Weak', 'Medium', 'Strong'];
    const nextIdx = (states.indexOf(beaconSignal) + 1) % states.length;
    audioSystem.playRadarPing();
    if (onSignalCycle) onSignalCycle(states[nextIdx]);
  };

  return (
    <div className="glass-panel p-3.5 border-slate-700/60 bg-slate-950/80 shadow-lg">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-tactical font-bold tracking-wider text-slate-200">
            MISSION OBJECTIVE
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
          PRIMARY
        </span>
      </div>

      {/* Main Goal Banner */}
      <div className="p-2.5 rounded bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 mb-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{title}</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {distanceKm} KM
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between">
          <span>EXTRACTION SANCTUARY LZ</span>
          <span className="text-slate-500">ETA: ~75 MIN</span>
        </div>
      </div>

      {/* Current Sub-objective */}
      <div className="space-y-2 mb-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Current Objective:</span>
          <span className="text-cyan-400 font-bold">STAGE 1/3</span>
        </div>
        <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-xs text-slate-200 font-medium">
            {currentStep}
          </div>
        </div>
      </div>

      {/* Beacon Signal Strength Indicator */}
      <div 
        onClick={cycleSignal}
        className="p-2 rounded bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between group"
        title="Click to toggle simulated beacon signal strength"
      >
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5 text-cyan-400" />
          <div className="text-[10px] font-mono">
            <span className="text-slate-400">Beacon Signal: </span>
            <span className={`font-bold ${
              beaconSignal === 'Strong' ? 'text-emerald-400' :
              beaconSignal === 'Medium' ? 'text-cyan-400' : 'text-amber-400'
            }`}>
              {beaconSignal}
            </span>
          </div>
        </div>

        {/* 3-Bar Visual Indicator */}
        <div className="flex items-end gap-1 h-3.5">
          <div className={`w-1 rounded-sm transition-all ${
            activeLevel >= 1 ? 'h-1.5 bg-cyan-400' : 'h-1.5 bg-slate-700'
          }`} />
          <div className={`w-1 rounded-sm transition-all ${
            activeLevel >= 2 ? 'h-2.5 bg-cyan-400' : 'h-2.5 bg-slate-700'
          }`} />
          <div className={`w-1 rounded-sm transition-all ${
            activeLevel >= 3 ? 'h-3.5 bg-emerald-400' : 'h-3.5 bg-slate-700'
          }`} />
        </div>
      </div>

      <div className="mt-2 text-[9px] font-mono text-slate-500 text-center">
        FREQ: {beaconFreq} &bull; DIRECT LINE OF SIGHT
      </div>
    </div>
  );
}
