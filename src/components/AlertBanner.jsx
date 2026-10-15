import React, { useEffect } from 'react';
import { AlertTriangle, AlertOctagon, Droplets, ShieldAlert, X, ChevronRight } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  useEffect(() => {
    // Play alert audio when alert shows
    audioSystem.playAlert();
  }, [alert.id, alert.title]);

  const getAlertStyle = (type) => {
    switch (type) {
      case 'danger':
      case 'critical':
        return {
          border: 'border-red-500/70',
          bg: 'bg-red-950/85',
          text: 'text-red-200',
          iconColor: 'text-red-400',
          badge: 'bg-red-900 text-red-300 border-red-500/50',
          glow: 'shadow-[0_8px_30px_rgba(239,68,68,0.35)]'
        };
      case 'warning':
        return {
          border: 'border-amber-500/70',
          bg: 'bg-amber-950/85',
          text: 'text-amber-200',
          iconColor: 'text-amber-400',
          badge: 'bg-amber-900 text-amber-300 border-amber-500/50',
          glow: 'shadow-[0_8px_30px_rgba(245,158,11,0.3)]'
        };
      case 'info':
      default:
        return {
          border: 'border-cyan-500/70',
          bg: 'bg-cyan-950/85',
          text: 'text-cyan-200',
          iconColor: 'text-cyan-400',
          badge: 'bg-cyan-900 text-cyan-300 border-cyan-500/50',
          glow: 'shadow-[0_8px_30px_rgba(0,242,254,0.3)]'
        };
    }
  };

  const style = getAlertStyle(alert.type);

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-auto animate-alert-slide">
      <div 
        className={`glass-panel p-3.5 rounded-lg border ${style.border} ${style.bg} ${style.glow} flex items-center justify-between gap-3`}
      >
        {/* Icon & Message */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-black/40 border border-white/10 shrink-0">
            {alert.type === 'danger' || alert.type === 'critical' ? (
              <AlertOctagon className={`w-5 h-5 ${style.iconColor} animate-pulse`} />
            ) : alert.type === 'warning' ? (
              <AlertTriangle className={`w-5 h-5 ${style.iconColor} animate-pulse`} />
            ) : (
              <ShieldAlert className={`w-5 h-5 ${style.iconColor}`} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${style.badge}`}>
                {alert.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                TACTICAL BROADCAST
              </span>
            </div>
            <p className={`text-xs md:text-sm font-medium ${style.text}`}>
              {alert.text}
            </p>
          </div>
        </div>

        {/* Action / Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              audioSystem.playTacticalBeep(600, 0.04);
              onDismiss();
            }}
            className="p-1.5 rounded bg-black/30 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Acknowledge alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
