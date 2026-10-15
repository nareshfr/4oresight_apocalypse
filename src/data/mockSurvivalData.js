// Mock Survival Data for ☢️ LAST BEACON
// Structured cleanly so Phase 2 pathfinding and real simulation can hook in seamlessly.

export const INITIAL_SURVIVORS = [
  {
    id: 'aarav',
    name: 'Aarav',
    role: 'Navigator / Scout',
    health: 90,
    condition: 'Stable',
    conditionColor: '#10b981',
    stamina: 84,
    heartRate: 72,
    avatar: 'A'
  },
  {
    id: 'mira',
    name: 'Mira',
    role: 'Engineer / Comms',
    health: 78,
    condition: 'Tired',
    conditionColor: '#f59e0b',
    stamina: 62,
    heartRate: 86,
    avatar: 'M'
  }
];

export const INITIAL_INVENTORY = {
  food: 6,
  foodMax: 10,
  water: 5,
  waterMax: 10,
  medicine: 2,
  medicineMax: 5,
  battery: 70
};

export const INITIAL_OBJECTIVE = {
  title: 'Reach The Last Beacon',
  distanceKm: 4.2,
  currentStep: 'Find a safe route',
  beaconSignal: 'Medium', // Weak, Medium, Strong
  beaconFreq: '142.85 MHz',
  etaMinutes: 75
};

export const MOCK_ROUTES = {
  safest: {
    id: 'safest',
    name: 'Safest Route',
    distance: '4.6 KM',
    distanceNum: 4.6,
    risk: 'Low',
    riskColor: '#10b981',
    waterCost: 2,
    foodCost: 2,
    estimatedTime: '1h 15m',
    description: 'Bypasses dense red zones via Western Canal Corridor & Substation Beta.',
    color: '#00f2fe',
    // Series of street intersections [x, y] on the 1000x800 coordinate system
    path: [
      { x: 220, y: 690 },
      { x: 220, y: 560 },
      { x: 360, y: 560 }, // City Mart waypoint
      { x: 360, y: 440 },
      { x: 490, y: 440 },
      { x: 490, y: 320 },
      { x: 670, y: 320 },
      { x: 670, y: 220 },
      { x: 860, y: 220 },
      { x: 860, y: 150 }  // Beacon
    ]
  },
  fastest: {
    id: 'fastest',
    name: 'Fastest Route',
    distance: '3.8 KM',
    distanceNum: 3.8,
    risk: 'High',
    riskColor: '#ef4444',
    waterCost: 1,
    foodCost: 1,
    estimatedTime: '48m',
    description: 'Direct cut across Midtown Expressway. Skims perimeter of critical horde zone.',
    color: '#f59e0b',
    path: [
      { x: 220, y: 690 },
      { x: 380, y: 610 },
      { x: 520, y: 470 },
      { x: 620, y: 390 }, // Near Safehouse Beta
      { x: 740, y: 270 },
      { x: 860, y: 150 }  // Beacon
    ]
  },
  compromised: {
    id: 'compromised',
    name: 'Compromised Corridor',
    distance: '5.4 KM',
    risk: 'Critical',
    riskColor: '#ef4444',
    blockedSegment: { x1: 490, y1: 440, x2: 490, y2: 320 },
    alternatePath: [
      { x: 220, y: 690 },
      { x: 220, y: 560 },
      { x: 360, y: 560 },
      { x: 280, y: 400 },
      { x: 310, y: 260 },
      { x: 540, y: 220 },
      { x: 670, y: 220 },
      { x: 860, y: 220 },
      { x: 860, y: 150 }
    ]
  }
};

export const POI_LOCATIONS = [
  {
    id: 'poi-start',
    name: 'Current Position (Aarav & Mira)',
    shortName: 'Aarav & Mira',
    type: 'Survivor Position',
    category: 'player',
    x: 220,
    y: 690,
    distance: '0.0 KM',
    risk: 'Low',
    riskColor: '#10b981',
    description: 'Bunker 12 basement exit. Current regroup point.',
    available: 'Supplies secured',
    isCurrent: true
  },
  {
    id: 'poi-beacon',
    name: 'The Last Beacon',
    shortName: 'LAST BEACON',
    type: 'Sanctuary Relay Tower',
    category: 'beacon',
    x: 860,
    y: 150,
    distance: '4.2 KM',
    risk: 'Guarded Perimeter',
    riskColor: '#10b981',
    description: 'High-power emergency broadcast array. Automated extraction LZ.',
    available: 'Full Medical & Extraction',
    isBeacon: true
  },
  {
    id: 'poi-citymart',
    name: 'City Mart',
    shortName: 'CITY MART',
    type: 'Supply Store',
    category: 'store',
    x: 360,
    y: 560,
    distance: '0.5 KM',
    detour: '+0.5 KM',
    risk: 'Medium',
    riskColor: '#f59e0b',
    description: 'Abandoned grocery department store. Non-perishables reported inside.',
    available: 'Food +3, Water +2',
    rewards: { food: 3, water: 2, medicine: 0 }
  },
  {
    id: 'poi-pharmacy',
    name: 'Metro Care Rx',
    shortName: 'PHARMACY',
    type: 'Medical Pharmacy',
    category: 'pharmacy',
    x: 490,
    y: 440,
    distance: '0.8 KM',
    detour: '+0.3 KM',
    risk: 'Low',
    riskColor: '#10b981',
    description: 'Sealed clinical dispensary with antibiotics and sterile bandages.',
    available: 'Medicine +3, Water +1',
    rewards: { food: 0, water: 1, medicine: 3 }
  },
  {
    id: 'poi-shelter',
    name: 'Survival Hut Beta',
    shortName: 'SURVIVAL HUT',
    type: 'Fortified Shelter',
    category: 'shelter',
    x: 620,
    y: 390,
    distance: '1.1 KM',
    detour: '+0.6 KM',
    risk: 'Low',
    riskColor: '#10b981',
    description: 'Reinforced utility basement with solar backup and lockable hatch.',
    available: 'Battery +25%, Safe Rest Zone',
    rewards: { battery: 25, rest: true }
  },
  {
    id: 'poi-cache',
    name: 'Supply Cache Bravo',
    shortName: 'SUPPLY CACHE',
    type: 'Military Air-Drop',
    category: 'cache',
    x: 740,
    y: 270,
    distance: '1.5 KM',
    detour: '+0.8 KM',
    risk: 'High',
    riskColor: '#ef4444',
    description: 'Crashed emergency cargo canister. High zombie movement around crater.',
    available: 'Food +2, Water +3, Med +1',
    rewards: { food: 2, water: 3, medicine: 1 }
  }
];

export const ZOMBIE_DANGER_ZONES = [
  {
    id: 'danger-1',
    name: 'SECTOR 4 HORDE',
    level: 'CRITICAL',
    badgeColor: '#ef4444',
    x: 480,
    y: 340,
    radius: 95,
    swarmCount: '120+ Hostiles',
    density: 'Dense Infestation',
    subtext: 'High biomass aggregation around hospital plaza'
  },
  {
    id: 'danger-2',
    name: 'MIDTOWN CANAL SWARM',
    level: 'HIGH',
    badgeColor: '#f97316',
    x: 620,
    y: 530,
    radius: 75,
    swarmCount: '45-60 Hostiles',
    density: 'Active Roamers',
    subtext: 'Migrating along drainage culverts'
  },
  {
    id: 'danger-3',
    name: 'OLD SUBWAY INFESTATION',
    level: 'MEDIUM',
    badgeColor: '#eab308',
    x: 290,
    y: 330,
    radius: 65,
    swarmCount: '20-30 Hostiles',
    density: 'Subterranean Nest',
    subtext: 'Noise alerts could draw them above ground'
  },
  {
    id: 'danger-4',
    name: 'OUTPOST PERIMETER',
    level: 'LOW',
    badgeColor: '#06b6d4',
    x: 780,
    y: 430,
    radius: 50,
    swarmCount: 'Scattered Lurkers',
    density: 'Low Threat',
    subtext: 'Isolated contacts, manageable stealth'
  }
];

export const INITIAL_EVENT_LOG = [
  {
    id: 'ev-1',
    time: '18:32',
    type: 'ALERT',
    badge: 'danger',
    message: 'Zombie activity detected in Sector 4 perimeter'
  },
  {
    id: 'ev-2',
    time: '18:25',
    type: 'INFO',
    badge: 'info',
    message: 'Route analysis completed: Western Corridor validated'
  },
  {
    id: 'ev-3',
    time: '18:10',
    type: 'MISSION',
    badge: 'mission',
    message: 'Beacon signal acquired on 142.85 MHz (Distance: 4.2 KM)'
  },
  {
    id: 'ev-4',
    time: '17:56',
    type: 'ALERT',
    badge: 'warning',
    message: 'Emergency network offline. Switched to offline peer mesh'
  },
  {
    id: 'ev-5',
    time: '17:40',
    type: 'INFO',
    badge: 'info',
    message: 'Survivor biometrics initialized: Aarav 90% | Mira 78%'
  }
];

export const CITY_DISTRICTS = [
  { name: 'OLD CANAL DISTRICT', x: 210, y: 760 },
  { name: 'ZILKER RUINS', x: 180, y: 460 },
  { name: 'SECTOR 7 - DOWNTOWN', x: 470, y: 220 },
  { name: 'NORTH INDUSTRIAL', x: 380, y: 140 },
  { name: 'OAK RIDGE PERIMETER', x: 740, y: 580 },
  { name: 'BEACON SANCTUARY LZ', x: 840, y: 90 }
];

// Sample simulated events triggered on click
export const SIMULATED_EVENTS = [
  {
    id: 'sim-horde',
    alert: {
      type: 'danger',
      title: 'RED ALERT',
      text: 'HORDE PROXIMITY CRITICAL — 80+ entities shifting south toward Route B'
    },
    log: {
      time: '18:38',
      type: 'ALERT',
      badge: 'danger',
      message: 'Horde proximity critical: Sector 4 migration detected'
    }
  },
  {
    alert: {
      type: 'warning',
      title: 'THREAT NEARBY',
      text: 'Zombie activity detected ahead on 5th Avenue'
    },
    log: {
      time: '18:41',
      type: 'ALERT',
      badge: 'warning',
      message: 'Unconfirmed acoustic signature 300m north'
    }
  },
  {
    alert: {
      type: 'critical',
      title: 'SAFE ROUTE COMPROMISED',
      text: 'Alternative path required: Central viaduct blocked by debris'
    },
    log: {
      time: '18:44',
      type: 'ALERT',
      badge: 'danger',
      message: 'Road blocked at Sector 4 crossover. Detour required'
    }
  },
  {
    alert: {
      type: 'warning',
      title: 'WATER LOW',
      text: 'Water supply depleted to 3 units. Find supplies before continuing'
    },
    log: {
      time: '18:48',
      type: 'INFO',
      badge: 'warning',
      message: 'Resource depletion warning: Hydration reserves at 30%'
    }
  }
];
