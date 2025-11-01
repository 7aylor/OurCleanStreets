import convert from 'convert';

export const getRouteColorByDate = (routeDate: Date): string => {
  const now = new Date();

  const diffInMonths =
    (now.getFullYear() - routeDate.getFullYear()) * 12 +
    (now.getMonth() - routeDate.getMonth());

  if (diffInMonths <= 3) return 'green';
  if (diffInMonths <= 6) return 'orange';
  return 'red';
};

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
  const miles = convert(distance ?? 0, from).to(to);
  return `${Math.round(miles * 100) / 100}mi`;
};
