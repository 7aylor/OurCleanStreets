export const OCS_API_URL =
  import.meta.env.VITE_OCS_API_URL ?? 'http://localhost:5000';

export const getDurationParts = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const _seconds = Math.round(seconds % 60);

  return { hours, minutes, seconds: _seconds };
};
