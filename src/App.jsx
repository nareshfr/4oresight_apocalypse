import React, { useState } from 'react';
import CinematicLanding from './components/CinematicLanding';
import TopHUD from './components/TopHUD';
import TacticalMap from './components/Map/TacticalMap';
import LeftPanelContainer from './components/LeftPanels/LeftPanelContainer';
import RightPanelContainer from './components/RightPanels/RightPanelContainer';
import BottomControls from './components/BottomControls';
import SelectedLocationModal from './components/SelectedLocationModal';
import AlertBanner from './components/AlertBanner';
import { audioSystem } from './utils/audioSystem';
import {
  INITIAL_SURVIVORS,
  INITIAL_INVENTORY,
  INITIAL_OBJECTIVE,
  MOCK_ROUTES,
  POI_LOCATIONS,
  ZOMBIE_DANGER_ZONES,
  INITIAL_EVENT_LOG,
  SIMULATED_EVENTS
} from './data/mockSurvivalData';

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'map'
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Survival & Route State
  const [activeRouteKey, setActiveRouteKey] = useState('safest');
  const [isCompromised, setIsCompromised] = useState(false);
  const [showThreatZones, setShowThreatZones] = useState(true);

  // Entities & Data
  const [survivors, setSurvivors] = useState(INITIAL_SURVIVORS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [objective, setObjective] = useState(INITIAL_OBJECTIVE);
  const [locations, setLocations] = useState(POI_LOCATIONS);
  const [dangerZones, setDangerZones] = useState(ZOMBIE_DANGER_ZONES);
  const [events, setEvents] = useState(INITIAL_EVENT_LOG);

  // Modals & Overlays
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [plannedStops, setPlannedStops] = useState([]);

  // Journey progression step along active path
  const [journeyStep, setJourneyStep] = useState(0);
  const [simEventIndex, setSimEventIndex] = useState(0);

  // Current Route Object
  const currentRoute = MOCK_ROUTES[activeRouteKey] || MOCK_ROUTES.safest;
  const activePath = isCompromised && activeRouteKey === 'safest'
    ? MOCK_ROUTES.compromised.alternatePath
    : currentRoute.path;

  // Survivor Current Coordinates
  const currentSurvivorPos = activePath[journeyStep] || activePath[0];

  // Selected Location Object
  const selectedLocation = locations.find((l) => l.id === selectedLocationId) || null;

  // Audio Toggle
  const handleToggleAudio = () => {
    const active = audioSystem.toggleMute();
    setIsAudioMuted(!active);
  };

  // Start / Continue Journey from Landing
  const handleStartJourney = () => {
    setCurrentScreen('map');
    audioSystem.playRadarPing();
    
    // Add initial tactical notice
    setCurrentAlert({
      id: 'alert-welcome',
      type: 'info',
      title: 'GPS MESH SYNCHRONIZED',
      text: 'Last Beacon signal locked (4.2 KM). Safest path via Western Canal active.'
    });
  };

  // Switch Route (Safest vs Fastest)
  const handleSelectRoute = (routeKey) => {
    setActiveRouteKey(routeKey);
    setJourneyStep(0); // Reset to start of new route
    
    const targetRoute = MOCK_ROUTES[routeKey];
    setObjective((prev) => ({
      ...prev,
      distanceKm: targetRoute.distanceNum,
      etaMinutes: routeKey === 'safest' ? 75 : 48,
      currentStep: `Following ${targetRoute.name}`
    }));

    // Add event log
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        time: timeStr,
        type: 'INFO',
        badge: 'info',
        message: `Route switched to ${targetRoute.name} (${targetRoute.distance})`
      },
      ...prev
    ]);
  };

  // Toggle Safe Route Compromise state
  const handleToggleCompromised = () => {
    const nextCompromised = !isCompromised;
    setIsCompromised(nextCompromised);

    if (nextCompromised) {
      setCurrentAlert({
        id: 'alert-compromised',
        type: 'danger',
        title: 'SAFE ROUTE COMPROMISED',
        text: 'Massive debris block & horde at Sector 4 crossover! Alternate canal detour calculated.'
      });
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          time: timeStr,
          type: 'ALERT',
          badge: 'danger',
          message: 'CRITICAL: Route segment blocked. Auto-routing via detour.'
        },
        ...prev
      ]);
    } else {
      setCurrentAlert({
        id: 'alert-cleared',
        type: 'info',
        title: 'ROUTE RE-CLEARED',
        text: 'Standard Western Canal corridor resumed.'
      });
    }
  };

  // Step progression along active route
  const handleContinueJourney = () => {
    if (journeyStep < activePath.length - 1) {
      const nextStep = journeyStep + 1;
      setJourneyStep(nextStep);

      // Decrement small resources to reflect progress
      setInventory((prev) => ({
        ...prev,
        water: Math.max(1, prev.water - 0.5),
        battery: Math.max(10, prev.battery - 3)
      }));

      // Update distance remaining
      const percentDone = nextStep / (activePath.length - 1);
      const remainingKm = (currentRoute.distanceNum * (1 - percentDone)).toFixed(1);

      setObjective((prev) => ({
        ...prev,
        distanceKm: parseFloat(remainingKm),
        currentStep: nextStep === activePath.length - 1 
          ? 'Beacon Extraction LZ Reached!' 
          : `Advancing to Waypoint ${nextStep + 1}`
      }));

      // Log movement
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          time: timeStr,
          type: 'INFO',
          badge: 'mission',
          message: `Squad advanced to Sector Waypoint ${nextStep + 1} (${remainingKm} KM remaining)`
        },
        ...prev
      ]);

      if (nextStep === activePath.length - 1) {
        audioSystem.playTacticalBeep(1200, 0.4);
        setCurrentAlert({
          id: 'alert-reached',
          type: 'info',
          title: 'SANCTUARY REACHED',
          text: 'Beacon perimeter secured! Automated medical & extraction protocol activated.'
        });
      }
    } else {
      // Reached destination, loop or reset
      setJourneyStep(0);
      setObjective((prev) => ({
        ...prev,
        distanceKm: currentRoute.distanceNum,
        currentStep: 'Find a safe route'
      }));
    }
  };

  // Simulate Event (Horde, Low Water, Threat)
  const handleSimulateEvent = () => {
    const nextIdx = (simEventIndex + 1) % SIMULATED_EVENTS.length;
    setSimEventIndex(nextIdx);
    const eventData = SIMULATED_EVENTS[nextIdx];

    setCurrentAlert({
      id: `sim-${Date.now()}`,
      ...eventData.alert
    });

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        time: timeStr,
        ...eventData.log
      },
      ...prev
    ]);
  };

  // Select POI Marker
  const handleSelectMarker = (poi) => {
    setSelectedLocationId(poi.id);
  };

  // Set Stop at POI
  const handleSetStop = (poi) => {
    if (plannedStops.includes(poi.id)) {
      setPlannedStops(plannedStops.filter((id) => id !== poi.id));
    } else {
      setPlannedStops([...plannedStops, poi.id]);
      // If store, award resources mock
      if (poi.rewards) {
        setInventory((prev) => ({
          ...prev,
          food: Math.min(prev.foodMax, prev.food + (poi.rewards.food || 0)),
          water: Math.min(prev.waterMax, prev.water + (poi.rewards.water || 0)),
          medicine: Math.min(prev.medicineMax, prev.medicine + (poi.rewards.medicine || 0))
        }));
      }
      setCurrentAlert({
        id: `stop-${Date.now()}`,
        type: 'info',
        title: 'WAYPOINT ADDED',
        text: `Stop registered: ${poi.name}. Supply scavenge scheduled.`
      });
    }
  };

  // Recenter map
  const handleRecenter = () => {
    // Handled by TacticalMap or resets selected location
    setSelectedLocationId(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans">
      {/* 1. Cinematic Landing Screen Overlay */}
      {currentScreen === 'landing' && (
        <CinematicLanding onStartJourney={handleStartJourney} />
      )}

      {/* 2. Main Survival Tactical Map Screen */}
      {currentScreen === 'map' && (
        <div className="relative w-full h-full">
          {/* Top Floating HUD Bar */}
          <TopHUD
            day={19}
            threatLevel={isCompromised ? 'CRITICAL' : 'HIGH'}
            distance={`${objective.distanceKm} KM`}
            missionStatus={objective.distanceKm === 0 ? 'COMPLETED' : 'ACTIVE'}
            offlineActive={true}
            isAudioMuted={isAudioMuted}
            onToggleAudio={handleToggleAudio}
            onReturnLanding={() => setCurrentScreen('landing')}
            onRecenter={handleRecenter}
            activeRouteName={currentRoute.name}
          />

          {/* Alert Notification Banner */}
          <AlertBanner
            alert={currentAlert}
            onDismiss={() => setCurrentAlert(null)}
          />

          {/* Left Floating Mission & Survival Panels */}
          <LeftPanelContainer
            survivors={survivors}
            inventory={inventory}
            objective={objective}
            onSignalCycle={() => {
              const signals = ['Weak', 'Medium', 'Strong'];
              const nextSignal = signals[(signals.indexOf(objective.beaconSignal) + 1) % signals.length];
              setObjective((prev) => ({ ...prev, beaconSignal: nextSignal }));
            }}
          />

          {/* Central Full-Screen Tactical 2D SVG Map */}
          <TacticalMap
            poiLocations={locations}
            dangerZones={dangerZones}
            activeRouteKey={activeRouteKey}
            routesData={MOCK_ROUTES}
            isCompromised={isCompromised}
            currentSurvivorPos={currentSurvivorPos}
            selectedLocationId={selectedLocationId}
            onSelectMarker={handleSelectMarker}
            showThreatZones={showThreatZones}
            onToggleThreatZones={() => setShowThreatZones(!showThreatZones)}
          />

          {/* Right Floating Routes & Telemetry Panels */}
          <RightPanelContainer
            activeRouteKey={activeRouteKey}
            onSelectRoute={handleSelectRoute}
            routesData={MOCK_ROUTES}
            isCompromised={isCompromised}
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={handleSelectMarker}
            events={events}
          />

          {/* Selected Location Modal Inspector */}
          <SelectedLocationModal
            location={selectedLocation}
            onClose={() => setSelectedLocationId(null)}
            onSetStop={handleSetStop}
            onViewRoute={() => setSelectedLocationId(null)}
            isCurrentStop={selectedLocation ? plannedStops.includes(selectedLocation.id) : false}
          />

          {/* Bottom Floating Tactical Controls */}
          <BottomControls
            activeRouteKey={activeRouteKey}
            onSelectRoute={handleSelectRoute}
            onContinueJourney={handleContinueJourney}
            onSimulateEvent={handleSimulateEvent}
            isCompromised={isCompromised}
            onToggleCompromised={handleToggleCompromised}
            journeyStep={journeyStep}
            maxSteps={activePath.length}
            showThreatZones={showThreatZones}
            onToggleThreatZones={() => setShowThreatZones(!showThreatZones)}
          />
        </div>
      )}
    </div>
  );
}
