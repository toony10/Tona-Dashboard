export type GetDateOptions = {
  locale?: string;
  withTime?: boolean;
};

export function getDate(date: string, options: GetDateOptions = {}): string {
  const { locale = "en", withTime = false } = options;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const dateParts = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).formatToParts(parsed);

  const day = dateParts.find((part) => part.type === "day")?.value;
  const month = dateParts.find((part) => part.type === "month")?.value;
  const year = dateParts.find((part) => part.type === "year")?.value;
  const formatted = [day, month, year].filter(Boolean).join(" ");

  if (!withTime) return formatted;

  const timeParts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    numberingSystem: "latn",
  }).formatToParts(parsed);

  const hour = timeParts.find((part) => part.type === "hour")?.value;
  const minute = timeParts.find((part) => part.type === "minute")?.value;
  const dayPeriod = timeParts.find((part) => part.type === "dayPeriod")?.value;
  if (hour == null || minute == null) return formatted;

  const time = `${hour}:${minute.padStart(2, "0")}`;
  return dayPeriod ? `${formatted} ${time} ${dayPeriod}` : `${formatted} ${time}`;
}
