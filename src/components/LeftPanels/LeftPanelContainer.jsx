import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import SurvivorCard from './SurvivorCard';
import InventoryCard from './InventoryCard';
import ObjectiveCard from './ObjectiveCard';

export default function LeftPanelContainer({
  survivors,
  inventory,
  objective,
  onSignalCycle
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`fixed top-16 left-3 bottom-16 z-20 flex transition-all duration-300 pointer-events-none ${
        isCollapsed ? '-translate-x-[calc(100%-12px)]' : 'translate-x-0'
      }`}
    >
      <div className="flex h-full">
        {/* Panel Content Column */}
        <div className="w-72 lg:w-80 h-full overflow-y-auto space-y-3 pointer-events-auto pr-1 pb-2">
          <SurvivorCard survivors={survivors} />
          <InventoryCard inventory={inventory} />
          <ObjectiveCard objective={objective} onSignalCycle={onSignalCycle} />
        </div>

        {/* Collapse / Expand Toggle Tab */}
        <div className="flex items-center ml-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="pointer-events-auto p-1.5 rounded-r bg-slate-950/90 border-r border-t border-b border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-950/60 shadow-lg cursor-pointer transition-colors"
            title={isCollapsed ? "Expand Team & Status" : "Collapse Team & Status"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
