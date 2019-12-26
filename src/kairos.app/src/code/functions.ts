import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  getDate,
  isWithinInterval,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subYears,
  addHours,
  addMinutes,
} from 'date-fns';
import { filter, groupBy, join, divide, converge, sum, length } from 'ramda';
import { padNumber } from '../code/padNumber';
import { TimeEntryListModel } from '../models/time-entry-list.model';

export const filterByInterval = (interval: Interval) =>
  filter((te: TimeEntryListModel) => isWithinInterval(te.when, interval));

export const groupByDate = groupBy((te: TimeEntryListModel) =>
  getDate(te.when).toString(),
);

export const average = converge(divide, [sum, length]);

export const humanDifference = (
  left: Date,
  right: Date,
  relativeToWorkingHours = 0,
) => {

  // relative to working hours tbd
  
  const result = [];
  const years = differenceInYears(right, left);
  if (years > 0) {
    result.push(`${padNumber(years)}yr`);
    right = subYears(right, years);
  }

  const months = differenceInMonths(right, left);
  if (months > 0) {
    result.push(`${padNumber(months)}mt`);
    right = subMonths(right, months);
  }

  const days = differenceInDays(right, left);
  if (days > 0) {
    result.push(`${padNumber(days)}d`);
    right = subDays(right, days);
  }

  const time: string[] = [];

  const hours = differenceInHours(right, left);
  time.push(`${padNumber(hours)}`);
  right = subHours(right, hours);

  const minutes = differenceInMinutes(right, left);
  time.push(`${padNumber(minutes)}`);
  right = subMinutes(right, minutes);

  result.push(join(':', time));

  const str = join(' ', result);

  if (str === '00:00') {
    return '-';
  }

  return str;
};

export const humanDifferenceFromHours = (
  hours: number,
  relativeToWorkingHours = 0,
) => {
  const percentualMinutes = hours % 1;
  hours = hours - percentualMinutes;
  const minutes = 60 * percentualMinutes;

  let date = new Date(0);

  date = addHours(date, hours);
  date = addMinutes(date, minutes);

  return humanDifference(new Date(0), date, relativeToWorkingHours);
};
