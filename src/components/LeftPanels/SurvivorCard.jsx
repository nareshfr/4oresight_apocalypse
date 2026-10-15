import React from 'react';
import { Heart, Activity, User, ShieldAlert } from 'lucide-react';

export default function SurvivorCard({ survivors }) {
  return (
    <div className="glass-panel p-3.5 border-slate-700/60 bg-slate-950/80 shadow-lg">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-tactical font-bold tracking-wider text-slate-200">
            SURVIVORS
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
          TEAM: 2/2 ALIVE
        </span>
      </div>

      {/* Survivor Entries */}
      <div className="space-y-3">
        {survivors.map((survivor) => {
          const isAarav = survivor.id === 'aarav';
          const isWarning = survivor.health < 80;
          return (
            <div 
              key={survivor.id}
              className="p-2.5 rounded bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {/* Tactical Avatar Badge */}
                  <div className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs border ${
                    isAarav 
                      ? 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300' 
                      : 'border-amber-500/40 bg-amber-950/60 text-amber-300'
                  }`}>
                    {survivor.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{survivor.name}</span>
                      <span className="text-[9px] font-mono text-slate-500">[{survivor.role}]</span>
                    </div>
                  </div>
                </div>

                {/* Condition Status Pill */}
                <div className="flex items-center gap-1.5">
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: survivor.conditionColor }} 
                  />
                  <span 
                    className="text-[10px] font-mono font-medium"
                    style={{ color: survivor.conditionColor }}
                  >
                    {survivor.condition}
                  </span>
                </div>
              </div>

              {/* Health Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    Health
                  </span>
                  <span className="text-slate-200 font-bold">{survivor.health}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      survivor.health > 80 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : survivor.health > 50 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                        : 'bg-gradient-to-r from-rose-600 to-red-500'
                    }`}
                    style={{ width: `${survivor.health}%` }}
                  />
                </div>
              </div>

              {/* Telemetry subline: Stamina & Heart Rate */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/70 flex justify-between text-[9px] font-mono text-slate-400">
                <span>STAMINA: {survivor.stamina}%</span>
                <span>PULSE: {survivor.heartRate} BPM</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
