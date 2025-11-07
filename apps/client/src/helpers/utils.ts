export const getRouteColorByDate = (routeDate: Date): string => {
  const now = new Date();

  const diffInMonths =
    (now.getFullYear() - routeDate.getFullYear()) * 12 +
    (now.getMonth() - routeDate.getMonth());

  if (diffInMonths <= 3) return 'green';
  if (diffInMonths <= 6) return 'orange';
  return 'red';
};
