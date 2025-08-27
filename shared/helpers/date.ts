export function parseShortDate(date: Date | string, locale: string) {
  const d = new Date(date);
  const df = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  });

  return df.format(d);
}

export function parseShortTime(date: Date | string, locale: string) {
  const d = new Date(date);
  const df = new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
  });

  return df.format(d);
}
