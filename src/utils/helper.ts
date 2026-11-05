export function getDurationInDaysPanel(durationInDays: number) {
  return `${durationInDays} дней`;
}

export function getDailyDurationInMinutesPanel(from: number, to: number) {
  return `${from}-${to} мин/день`;
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
}
