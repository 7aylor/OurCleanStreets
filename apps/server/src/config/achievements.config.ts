// achievements.config.ts
export const ACHIEVEMENT_CONFIG = {
  // min/max in lbs
  weight: [
    { level: 1, min: 0, max: 5, label: 'Rookie Collector' },
    { level: 2, min: 5, max: 12, label: 'Recycler' },
    { level: 3, min: 12, max: 25, label: 'Collector' },
    { level: 4, min: 25, max: 50, label: 'Gatherer' },
    { level: 5, min: 50, max: 100, label: 'Steward' },
    { level: 6, min: 100, max: 150, label: 'Guardian' },
    { level: 7, min: 150, max: 225, label: 'Protector' },
    { level: 8, min: 225, max: 325, label: 'Champion' },
    { level: 9, min: 325, max: 500, label: 'Vanguard' },
    { level: 10, min: 500, max: Infinity, label: 'Legend' },
  ],

  // min/max in miles
  distance: [
    { level: 1, min: 0, max: 1, label: 'Rookie Traveler' },
    { level: 2, min: 1, max: 5, label: 'Wanderer' },
    { level: 3, min: 5, max: 10, label: 'Pathfinder' },
    { level: 4, min: 10, max: 25, label: 'Explorer' },
    { level: 5, min: 25, max: 50, label: 'Voyager' },
    { level: 6, min: 50, max: 100, label: 'Trailblazer' },
    { level: 7, min: 100, max: 200, label: 'Adventurer' },
    { level: 8, min: 200, max: 350, label: 'Navigator' },
    { level: 9, min: 350, max: 500, label: 'Wayfinder' },
    { level: 10, min: 500, max: Infinity, label: 'Globetrotter' },
  ],

  // min/max in hours
  duration: [
    { level: 1, min: 0, max: 1, label: 'Rookie Timekeeper' },
    { level: 2, min: 1, max: 5, label: 'Clockwatcher' },
    { level: 3, min: 5, max: 10, label: 'Dedicated' },
    { level: 4, min: 10, max: 25, label: 'Persistent' },
    { level: 5, min: 25, max: 50, label: 'Committed' },
    { level: 6, min: 50, max: 100, label: 'Enduring' },
    { level: 7, min: 100, max: 200, label: 'Marathoner' },
    { level: 8, min: 200, max: 350, label: 'Relentless' },
    { level: 9, min: 350, max: 500, label: 'Unstoppable' },
    { level: 10, min: 500, max: Infinity, label: 'Timeless Legend' },
  ],
};
