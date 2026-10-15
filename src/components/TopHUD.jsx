import React from 'react';
import { Radio, AlertOctagon, Navigation, ShieldCheck, WifiOff, Volume2, VolumeX, RotateCcw, Target } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export default function TopHUD({
  day = 19,
  threatLevel = 'HIGH',
  distance = '4.2 KM',
  missionStatus = 'ACTIVE',
  offlineActive = true,
  isAudioMuted,
  onToggleAudio,
  onReturnLanding,
  onRecenter,
  activeRouteName = 'SAFEST'
}) {
  return (
    <header className="fixed top-3 left-3 right-3 z-30 pointer-events-none flex justify-center">
      <div className="glass-panel tactical-corners pointer-events-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 md:gap-6 border-cyan-500/25 bg-slate-950/80 shadow-[0_8px_30px_rgba(0,0,0,0.7)] max-w-7xl w-full">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">☢️</span>
            <div>
              <div className="text-sm font-tactical font-bold text-white tracking-widest flex items-center gap-1.5">
                <span>LAST BEACON</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-500/30">
                  NAV-OS
                </span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 tracking-wider">
                SURVIVAL COORDINATION SYSTEM
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* DAY 19 */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700/60 text-xs font-mono">
            <span className="text-slate-400">DAY</span>
            <span className="text-amber-400 font-bold">{day}</span>
          </div>
        </div>

        {/* Telemetry / Mission Status Badges */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5">
          {/* THREAT HIGH */}
          <div className="badge-tactical badge-red border-red-500/40 bg-red-950/40 px-2.5 py-1">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[10px]">THREAT:</span>
            <span className="text-red-400 font-bold tracking-wider">{threatLevel}</span>
          </div>

          {/* DISTANCE */}
          <div className="badge-tactical badge-cyan border-cyan-500/40 bg-cyan-950/40 px-2.5 py-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-mono text-[10px]">DISTANCE:</span>
            <span className="text-cyan-300 font-bold">{distance}</span>
          </div>

          {/* MISSION ACTIVE */}
          <div className="badge-tactical badge-cyan border-cyan-500/30 bg-slate-900/80 px-2.5 py-1 hidden md:flex">
            <Target className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-slate-400 font-mono text-[10px]">MISSION:</span>
            <span className="text-cyan-400 font-bold">{missionStatus}</span>
          </div>

          {/* OFFLINE MODE ACTIVE */}
          <div className="badge-tactical badge-green border-emerald-500/40 bg-emerald-950/30 px-2.5 py-1">
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-mono text-[10px] hidden lg:inline">OFFLINE MODE:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span>ACTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </span>
          </div>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center gap-2">
          {/* Recenter button */}
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(720, 0.05);
              onRecenter();
            }}
            title="Recenter Map on Survivors"
            className="p-1.5 rounded bg-slate-900/80 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              onToggleAudio();
            }}
            title={isAudioMuted ? "Unmute Tactical Soundscape" : "Mute Audio"}
            className="p-1.5 rounded bg-slate-900/80 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          {/* Return to intro */}
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(520, 0.08);
              onReturnLanding();
            }}
            title="Return to Standby Landing"
            className="px-2 py-1 rounded bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">STANDBY</span>
          </button>
        </div>

      </div>
    </header>
  );
}
