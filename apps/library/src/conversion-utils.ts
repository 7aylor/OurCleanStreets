// @ts-ignore
import convert from 'convert';

export const getDurationParts = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const _seconds = Math.round(seconds % 60);

  return { hours, minutes, seconds: _seconds };
};

export const getFormattedDuration = (duration: number) => {
  const { hours, minutes, seconds } = getDurationParts(duration ?? 0);
  return `${hours}h ${minutes}m ${seconds}s`;
};

type distanceTypes = 'miles' | 'meters' | 'km';

export const getFormattedDistance = (
  distance: number,
  from: distanceTypes = 'meters',
  to: distanceTypes = 'miles'
) => {
  return `${convertDistance(distance, from, to)}mi`;
};

export const convertDistance = (
  distance: number,
  from: distanceTypes = 'meters',
  to: distanceTypes = 'miles'
) => {
  const miles = convert(distance ?? 0, from).to(to);
  return Math.round(miles * 100) / 100;
};
