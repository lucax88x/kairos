import { endOfYear, setYear, startOfYear } from 'date-fns';

export function getRangeFromYear(year: number) {
  const start = startOfYear(setYear(new Date(), year));
  const end = endOfYear(setYear(new Date(), year));
  return [start, end];
}
