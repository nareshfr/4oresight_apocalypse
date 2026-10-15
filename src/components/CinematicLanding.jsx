import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Radio, Navigation, Compass, AlertTriangle, ArrowRight, Play } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export default function CinematicLanding({ onStartJourney }) {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggleAudio = () => {
    const active = audioSystem.toggleMute();
    setIsAudioMuted(!active);
  };

  const handleStart = () => {
    audioSystem.playTacticalBeep(920, 0.15);
    setIsTransitioning(true);
    setTimeout(() => {
      onStartJourney();
    }, 700);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black transition-opacity duration-700 ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Background Media with Dark Overlay and Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Full screen video element (with poster fallback) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/cinematic_bg.jpg"
          className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 scale-105"
          style={{
            animation: 'subtle-float 12s ease-in-out infinite alternate'
          }}
        >
          {/* Optional video source placeholder */}
          <source src="/assets/cinematic_loop.mp4" type="video/mp4" />
        </video>

        {/* Ambient fallback image container */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: `url('/assets/cinematic_bg.jpg')` }}
        />

        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" 
             style={{ background: 'radial-gradient(circle at center, transparent 35%, #03070d 95%)' }} />
        
        {/* Subtle grid and scanline effect */}
        <div className="absolute inset-0 tactical-grid-bg opacity-30" />
        <div className="absolute inset-0 scanline-overlay opacity-40" />
      </div>

      {/* Top Bar / Status */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.3)]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-cyan-400 font-semibold">
              TACTICAL SURVIVAL OS // V2.4-OFFLINE
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              LAT: 30.2672° N &bull; LON: 97.7431° W &bull; MESH: PEER DIRECT
            </div>
          </div>
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={handleToggleAudio}
          className="glass-panel px-4 py-2 flex items-center gap-2.5 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer border border-cyan-500/20"
          title={isAudioMuted ? "Unmute Tactical Atmosphere" : "Mute Sound"}
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>AUDIO: MUTED</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300">AUDIO: ONLINE</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </>
          )}
        </button>
      </header>

      {/* Main Foreground Cinematic Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto my-auto">
        {/* Day 19 Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_14px_rgba(245,158,11,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          DAY 19 OF COLLAPSE &bull; PROTOCOL 4-ALPHA
        </div>

        {/* Main Title */}
        <div className="relative mb-3">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-tactical font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_24px_rgba(0,242,254,0.35)]"
          >
            ☢️ LAST BEACON
          </h1>
          <div className="h-0.5 w-48 mx-auto mt-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        {/* Subtitle */}
        <p className="text-base md:text-lg font-tactical tracking-[0.25em] text-cyan-400 font-semibold mb-4">
          OFFLINE SURVIVAL COORDINATION SYSTEM
        </p>

        {/* Tagline */}
        <div className="text-xs md:text-sm font-mono text-slate-400 tracking-wider mb-8">
          SURVIVE &bull; PLAN &bull; REACH
        </div>

        {/* Welcome Message Box */}
        <div className="glass-panel tactical-corners px-8 py-5 max-w-xl mx-auto mb-10 border border-slate-700/60 bg-slate-950/70 shadow-2xl">
          <p className="text-lg md:text-xl font-medium text-slate-100 mb-1.5">
            “Welcome, Aarav and Mira.”
          </p>
          <p className="text-xs md:text-sm text-slate-400 font-mono leading-relaxed">
            “The city has fallen. The beacon is your last chance.”
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-around text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SURVIVORS: 2 ACTIVE
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              BEACON: 4.2 KM DETECTED
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              THREAT: HIGH
            </span>
          </div>
        </div>

        {/* Action Buttons Box */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mx-auto">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto btn-tactical btn-tactical-primary px-8 py-3.5 text-base text-white tracking-widest font-tactical group shadow-[0_0_25px_rgba(0,242,254,0.35)] flex items-center justify-center gap-3"
          >
            <Play className="w-4 h-4 fill-cyan-400 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            <span>START JOURNEY</span>
            <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              audioSystem.playTacticalBeep(600, 0.08);
              handleStart();
            }}
            className="w-full sm:w-auto btn-tactical px-7 py-3.5 text-base text-slate-300 hover:text-white tracking-widest font-tactical group border-slate-700/80 bg-slate-900/60"
          >
            <span>CONTINUE JOURNEY</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-800">
              DAY 19
            </span>
          </button>
        </div>
      </main>

      {/* Cinematic Footer / Diagnostics */}
      <footer className="relative z-10 px-8 py-4 border-t border-slate-900/90 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            OFFLINE STORAGE: 100% READY
          </span>
          <span className="hidden sm:inline text-slate-700">&bull;</span>
          <span className="hidden sm:inline">BATTERY: 70%</span>
          <span className="hidden sm:inline text-slate-700">&bull;</span>
          <span className="hidden sm:inline">ENCRYPTION: AES-256 AIR-GAPPED</span>
        </div>
        <div className="text-slate-500 tracking-wider">
          LAST BEACON TACTICAL OS &bull; ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
