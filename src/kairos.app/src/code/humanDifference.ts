import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addYears,
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
} from 'date-fns';
import Decimal from 'decimal.js';
import { join } from 'ramda';
import { padNumber } from '../code/padNumber';

const MONTHS_IN_YEAR = 12;
const DAYS_IN_MONTH = 30;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

const DAYS_IN_YEAR = DAYS_IN_MONTH * MONTHS_IN_YEAR;

export const humanDifference = (
  left: Date,
  right: Date,
  relativeToHours = 24,
) => {
  const difference = dateDifference(left, right);
  const totalHours = dateToHours(difference);
  return hoursToHuman(totalHours, relativeToHours);
};

export const humanDifferenceFromHours = (
  hours: number,
  relativeToHours = 24,
) => {
  const percentualMinutes = hours % 1;
  hours = hours - percentualMinutes;
  const minutes = 60 * percentualMinutes;

  let date = new Date(0);

  date = addHours(date, hours);
  date = addMinutes(date, minutes);

  return humanDifference(new Date(0), date, relativeToHours);
};

const formatWithoutDecimals = (number: Decimal): [string, Decimal] => {
  const remaining = number.mod(1);
  const toFormat = number.minus(remaining).round();
  return [padNumber(toFormat.toNumber()), remaining];
};

const hoursToHuman = (totalHours: Decimal, relativeToHours = 24) => {
  const result = [];
  const time = [];

  let years = new Decimal(0);
  let months = new Decimal(0);
  let days = new Decimal(0);
  let hours = new Decimal(0);
  let minutes = new Decimal(0);

  const totalDays = totalHours.div(relativeToHours);

  years = totalDays.div(DAYS_IN_YEAR);

  if (years.greaterThanOrEqualTo(1)) {
    const [formatted, remaining] = formatWithoutDecimals(years);
    months = remaining.mul(MONTHS_IN_YEAR);
    result.push(`${formatted}y`);
  } else {
    months = years.mul(MONTHS_IN_YEAR);
  }

  if (months.greaterThanOrEqualTo(1)) {
    const [formatted, remaining] = formatWithoutDecimals(months);
    days = remaining.mul(DAYS_IN_MONTH);
    result.push(`${formatted}m`);
  } else {
    days = months.mul(DAYS_IN_MONTH);
  }

  if (days.greaterThanOrEqualTo(1)) {
    const [formatted, remaining] = formatWithoutDecimals(days);
    hours = remaining.mul(relativeToHours);
    const suffix = relativeToHours === HOURS_IN_DAY ? 'd' : 'wd';
    result.push(`${formatted}${suffix}`);
  } else {
    hours = days.mul(relativeToHours);
  }

  if (hours.greaterThanOrEqualTo(1)) {
    const [formatted, remaining] = formatWithoutDecimals(hours);
    minutes = remaining.mul(MINUTES_IN_HOUR);
    time.push(`${formatted}`);
  } else {
    minutes = hours.mul(MINUTES_IN_HOUR);
  }

  if (minutes.greaterThanOrEqualTo(1)) {
    const [formatted] = formatWithoutDecimals(minutes);

    // there is no hour but we have minutes
    if (time.length === 0) {
      time.push('00');
    }
    time.push(`${formatted}`);
  } else if (time.length === 1) {
    // there is no minutes but we have hours
    time.push('00');
  }

  if (time.length > 0) {
    result.push(join(':', time));
  }

  const str = join(' ', result);

  if (str === '') {
    return '-';
  }

  return str;
};

const dateToHours = (date: Date): Decimal => {
  let totalHours = new Decimal(0);
  const minDate = new Date(0);

  const hours = differenceInHours(date, minDate);
  if (hours > 0) {
    date = subHours(date, hours);
    totalHours = totalHours.plus(hours);
  }

  const minutes = differenceInMinutes(date, minDate);
  if (minutes > 0) {
    date = subMinutes(date, minutes);
    totalHours = totalHours.plus(new Decimal(minutes).div(MINUTES_IN_HOUR));
  }

  return totalHours;
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
