export function parseStringMinutesToHourString(fullminutes: number) {
  const hours = Math.floor(fullminutes / 60);
  const minutes = fullminutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}
