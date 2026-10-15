import React, { useState } from 'react';
import { Terminal, AlertOctagon, Info, Target, ChevronDown } from 'lucide-react';

export default function EventLogCard({ events = [] }) {
  const [filter, setFilter] = useState('ALL');

  const filteredEvents = events.filter((ev) => {
    if (filter === 'ALL') return true;
    if (filter === 'ALERTS') return ev.type === 'ALERT';
    if (filter === 'INFO') return ev.type === 'INFO';
    if (filter === 'MISSION') return ev.type === 'MISSION';
    return true;
  });

  const alertCount = events.filter((ev) => ev.type === 'ALERT').length;

  return (
    <div className="glass-panel p-3.5 border-slate-700/60 bg-slate-950/80 shadow-lg flex flex-col max-h-64">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-tactical font-bold tracking-wider text-slate-200">
            EVENT LOG
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE TELEMETRY</span>
        </div>
      </div>

      {/* Filter Tabs (Inspired by Reference 1) */}
      <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-800/60 shrink-0 text-[10px] font-mono">
        {['ALL', 'ALERTS', 'INFO', 'MISSION'].map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab}</span>
              {tab === 'ALERTS' && alertCount > 0 && (
                <span className="px-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-[9px]">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scrollable Event Stream */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
        {filteredEvents.length === 0 ? (
          <div className="text-[11px] font-mono text-slate-500 text-center py-4">
            No events logged in this category.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isAlert = ev.type === 'ALERT';
            const isMission = ev.type === 'MISSION';

            return (
              <div
                key={ev.id || `${ev.time}-${ev.message}`}
                className={`p-2 rounded text-[11px] font-mono transition-all border ${
                  isAlert
                    ? 'bg-red-950/30 border-red-500/30 text-red-200'
                    : isMission
                    ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400">
                    {ev.time}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isAlert
                        ? 'bg-red-950 text-red-400 border border-red-700/60'
                        : isMission
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-700/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ev.type}
                  </span>
                </div>
                <div className="text-[11px] leading-snug">
                  {ev.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
