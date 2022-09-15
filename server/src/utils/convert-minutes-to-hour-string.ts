export function convertMinutesToHourString(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const min = minutes % 60;

  return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}