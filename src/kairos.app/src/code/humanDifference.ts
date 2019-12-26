import {
  addHours,
  addMinutes,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subYears,
  addYears,
  addMonths,
  addDays,
} from 'date-fns';
import { join } from 'ramda';
import { padNumber } from '../code/padNumber';

export const humanDifference = (
  left: Date,
  right: Date,
  relativeToWorkingHours = 0,
) => {
  // relative to working hours tbd

  const difference = dateDifference(left, right);
  console.log(difference);
  return dateToHuman(difference);
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

const dateToHuman = (date: Date) => {
  const minDate = new Date(0);

  const result = [];
  const years = differenceInYears(date, minDate);
  if (years > 0) {
    result.push(`${padNumber(years)}yr`);
    date = subYears(date, years);
  }

  const months = differenceInMonths(date, minDate);
  if (months > 0) {
    result.push(`${padNumber(months)}mt`);
    date = subMonths(date, months);
  }

  const days = differenceInDays(date, minDate);
  if (days > 0) {
    result.push(`${padNumber(days)}d`);
    date = subDays(date, days);
  }

  const time: string[] = [];

  const hours = differenceInHours(date, minDate);
  console.log(hours);
  time.push(`${padNumber(hours)}`);
  date = subHours(date, hours);

  const minutes = differenceInMinutes(date, minDate);
  time.push(`${padNumber(minutes)}`);
  date = subMinutes(date, minutes);

  result.push(join(':', time));

  const str = join(' ', result);

  if (str === '00:00') {
    return '-';
  }

  return str;
};

const dateDifference = (left: Date, right: Date) => {
  let difference = new Date(0);

  const years = differenceInYears(right, left);
  if (years > 0) {
    right = subYears(right, years);
    difference = addYears(difference, years);
  }

  const months = differenceInMonths(right, left);
  if (months > 0) {
    right = subMonths(right, months);
    difference = addMonths(difference, months);
  }

  const days = differenceInDays(right, left);
  if (days > 0) {
    right = subDays(right, days);
    difference = addDays(difference, days);
  }

  const hours = differenceInHours(right, left);
  difference = addHours(difference, hours);
  right = subHours(right, hours);

  const minutes = differenceInMinutes(right, left);
  difference = addMinutes(difference, minutes);
  right = subMinutes(right, minutes);

  return difference;
};
