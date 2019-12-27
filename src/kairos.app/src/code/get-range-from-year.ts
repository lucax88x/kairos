import { setYear, startOfYear } from 'date-fns';
import { maxDate } from './functions';

export function getRangeFromYear(year: number) {
  const start = startOfYear(setYear(new Date(), year));
  const end = maxDate;
  return [start, end];
}
