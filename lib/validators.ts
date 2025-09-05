export function formatDateUA(date: string): string {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  }).format(utcDate);
}
