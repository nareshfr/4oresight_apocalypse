import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import RouteInfoCard from './RouteInfoCard';
import NearbyLocationsCard from './NearbyLocationsCard';
import EventLogCard from './EventLogCard';

export default function RightPanelContainer({
  activeRouteKey,
  onSelectRoute,
  routesData,
  isCompromised,
  locations,
  selectedLocationId,
  onSelectLocation,
  events
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`fixed top-16 right-3 bottom-16 z-20 flex transition-all duration-300 pointer-events-none ${
        isCollapsed ? 'translate-x-[calc(100%-12px)]' : 'translate-x-0'
      }`}
    >
      <div className="flex h-full">
        {/* Collapse / Expand Toggle Tab */}
        <div className="flex items-center mr-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="pointer-events-auto p-1.5 rounded-l bg-slate-950/90 border-l border-t border-b border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-950/60 shadow-lg cursor-pointer transition-colors"
            title={isCollapsed ? "Expand Routes & Logs" : "Collapse Routes & Logs"}
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Panel Content Column */}
        <div className="w-72 lg:w-80 h-full overflow-y-auto space-y-3 pointer-events-auto pl-1 pb-2">
          <RouteInfoCard 
            activeRouteKey={activeRouteKey}
            onSelectRoute={onSelectRoute}
            routesData={routesData}
            isCompromised={isCompromised}
          />
          <NearbyLocationsCard
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={onSelectLocation}
          />
          <EventLogCard events={events} />
        </div>
      </div>
    </aside>
  );
}
