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

export const splitUsername = (email: string): string => {
  return capitalize(email.split('@')[0] || email);
};
