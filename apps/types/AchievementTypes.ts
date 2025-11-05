export type AchievementType = 'weight' | 'distance' | 'duration';

export type AchievementName = 'Trash Collector' | 'Traveler' | 'Timekeeper';

export type AchievementLevelNames =
  | 'Newbie'
  | 'Rookie'
  | 'Scout'
  | 'Apprentice'
  | 'Adventurer'
  | 'Challenger'
  | 'Expert'
  | 'Master'
  | 'Hero';

export interface Achievement {
  type: AchievementType;
  level: number;
  value: number; // the value of the achievement type, e.g. total duration, distance, etc
  nextLevel: number; // value to the next level
  label: AchievementName;
}
