// @ts-ignore
import convert from 'convert-units';

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

type distanceTypes = 'mi' | 'm' | 'km';

// export const getFormattedDistance = (
//   distance: number,
//   from: distanceTypes = 'meters',
//   to: distanceTypes = 'miles'
// ) => {
//   return `${convertDistance(distance, from, to)}mi`;
// };

// export const convertDistance = (
//   distance: number,
//   from: distanceTypes = 'meters',
//   to: distanceTypes = 'miles'
// ) => {
//   const miles = convert(distance ?? 0, from).to(to);
//   return Math.round(miles * 100) / 100;
// };

export const convertDistance = (
  distance: number,
  from: distanceTypes = 'km',
  to: distanceTypes = 'mi'
): number => {
  try {
    const converted = convert(distance ?? 0)
      .from(from)
      .to(to);
    return Math.round(converted * 100) / 100;
  } catch (error) {
    console.error('Distance conversion failed:', error);
    return 0;
  }
};

export const getFormattedDistance = (
  distance: number,
  from: distanceTypes = 'm', // meters
  to: distanceTypes = 'mi'
): string => {
  const value = convertDistance(distance, from, to);
  return `${value}${to}`;
};
