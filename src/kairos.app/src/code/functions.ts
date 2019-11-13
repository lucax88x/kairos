import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  getDate,
  isWithinInterval,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subSeconds,
  subYears,
} from 'date-fns';
import { filter, groupBy, join } from 'ramda';
import { padNumber } from '../code/padNumber';
import { TimeEntryListModel } from '../models/time-entry-list.model';

export const filterByInterval = (interval: Interval) =>
  filter((te: TimeEntryListModel) => isWithinInterval(te.when, interval));

export const groupByDate = groupBy((te: TimeEntryListModel) => getDate(te.when).toString());

export const humanDifference = (left: Date, right: Date) => {
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
  if (hours > 0) {
    time.push(`${padNumber(hours)}`);
    right = subHours(right, hours);
  } else {
    time.push('00');
  }

  const minutes = differenceInMinutes(right, left);
  if (minutes > 0) {
    time.push(`${padNumber(minutes)}`);
    right = subMinutes(right, minutes);
  } else {
    time.push('00');
  }

  // const seconds = differenceInSeconds(right, left);
  // if (seconds > 0) {
  //   time.push(`${padNumber(seconds)}`);
  //   right = subSeconds(right, seconds);
  // } else {
  //   time.push('00');
  // }

  result.push(join(':', time));

  const str = join(' ', result);

  if (str === '00:00') {
    return '-';
  }

  return str;
};
