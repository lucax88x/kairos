import { setHours, getHours, setMinutes, getMinutes } from 'date-fns';

export function mergeDateAndTime(date: Date, time: Date): Date {
  const withHours = setHours(date, getHours(time));
  const withMinutes = setMinutes(withHours, getMinutes(time));
  return withMinutes;
}
