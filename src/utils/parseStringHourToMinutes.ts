export function parseStringHoursToMinutes(fullHour: string) {
  const [hour, minute] = fullHour.split(":").map(Number);
  return hour * 60 + minute;
}
