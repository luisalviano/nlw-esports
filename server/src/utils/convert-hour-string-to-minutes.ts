export function convertHourStringToMinutes(hourString: string) {
  const [hrs, min] = hourString.split(':').map(Number);

  const minutes = (hrs * 60) + min;

  return minutes;
}