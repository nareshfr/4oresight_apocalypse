import React from 'react';
import { Package, Droplets, Utensils, Pill, Zap, AlertTriangle } from 'lucide-react';

export default function InventoryCard({ inventory }) {
  const { food = 6, water = 5, medicine = 2, battery = 70 } = inventory;

  const items = [
    {
      id: 'food',
      label: 'Food Rations',
      shortLabel: 'Food',
      count: food,
      max: 10,
      unit: 'Units',
      icon: Utensils,
      color: '#f59e0b',
      barColor: 'from-amber-500 to-yellow-400',
      isLow: food <= 3
    },
    {
      id: 'water',
      label: 'Purified Water',
      shortLabel: 'Water',
      count: water,
      max: 10,
      unit: 'Liters',
      icon: Droplets,
      color: '#00f2fe',
      barColor: 'from-cyan-500 to-blue-400',
      isLow: water <= 3
    },
    {
      id: 'medicine',
      label: 'Medical Kits',
      shortLabel: 'Medicine',
      count: medicine,
      max: 5,
      unit: 'Kits',
      icon: Pill,
      color: '#10b981',
      barColor: 'from-emerald-500 to-teal-400',
      isLow: medicine <= 1
    },
    {
      id: 'battery',
      label: 'Power Cell',
      shortLabel: 'Battery',
      count: battery,
      max: 100,
      unit: '%',
      icon: Zap,
      color: '#a855f7',
      barColor: 'from-purple-500 to-indigo-400',
      isLow: battery <= 25
    }
  ];

  return (
    <div className="glass-panel p-3.5 border-slate-700/60 bg-slate-950/80 shadow-lg">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-tactical font-bold tracking-wider text-slate-200">
            INVENTORY & SUPPLIES
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          CAPACITY: 65%
        </span>
      </div>

      {/* Grid of Resource Rows */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          const percentage = Math.min(100, Math.round((item.count / item.max) * 100));

          return (
            <div 
              key={item.id}
              className="p-2 rounded bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  <span className="text-slate-300 font-semibold">{item.shortLabel}:</span>
                  <span className="text-white font-bold">{item.count}</span>
                  {item.unit === '%' && <span>%</span>}
                </div>

                <div className="flex items-center gap-1">
                  {item.isLow && (
                    <span className="text-[9px] text-amber-400 font-mono flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                      LOW
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {item.count}/{item.max}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${item.barColor} transition-all duration-300 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Consumption projection footer */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span>RATE: -1 WATER/KM</span>
        <span className="text-cyan-400">RESTOCK: POI ACTIVE</span>
      </div>
    </div>
  );
}
