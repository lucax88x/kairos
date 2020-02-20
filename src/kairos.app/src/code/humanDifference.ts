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
import { minDate } from './functions';

const MONTHS_IN_YEAR = new Decimal(12);
const DAYS_IN_MONTH = new Decimal(30);
const HOURS_IN_DAY = new Decimal(24);
const MINUTES_IN_HOUR = new Decimal(60);

const DAYS_IN_YEAR = DAYS_IN_MONTH.mul(MONTHS_IN_YEAR);

export const humanDifference = (
  left: Date,
  right: Date,
  relativeToHours = new Decimal(24),
) => {
  const difference = dateDifference(left, right);
  const totalHours = dateToHours(difference);
  return hoursToHuman(totalHours, relativeToHours);
};

export const humanDifferenceFromHours = (
  hours: Decimal,
  relativeToHours: Decimal = new Decimal(24),
) => {
  const percentualMinutes = hours.mod(1);
  hours = hours.minus(percentualMinutes);
  const minutes = new Decimal(60).mul(percentualMinutes);

  let date = new Date(0);

  date = addHours(date, hours.toNumber());
  date = addMinutes(date, minutes.toNumber());

  return humanDifference(new Date(0), date, relativeToHours);
};

const withoutDecimals = (number: Decimal): [Decimal, Decimal] => {
  const remaining = number.mod(1);
  return [number.minus(remaining).round(), remaining];
};

const formatNumber = (number: Decimal): string => {
  return padNumber(number.toNumber());
};

const formatWithoutDecimals = (number: Decimal): [string, Decimal] => {
  const [toFormat, remaining] = withoutDecimals(number);
  return [formatNumber(toFormat), remaining];
};

const hoursToHuman = (totalHours: Decimal, relativeToHours = new Decimal(24)) => {
  const result = [];

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

  let toFormatHours = new Decimal(0);
  if (hours.greaterThanOrEqualTo(1)) {
    const [toFormatHoursTemp, remaining] = withoutDecimals(hours);
    toFormatHours = toFormatHoursTemp;
    minutes = remaining.mul(MINUTES_IN_HOUR);
  } else {
    minutes = hours.mul(MINUTES_IN_HOUR);
  }

  let time = '00:00';
  if (minutes.greaterThanOrEqualTo(1)) {
    if (minutes.lessThanOrEqualTo(7)) {
      minutes = new Decimal(0);
    } else if (minutes.lessThanOrEqualTo(22)) {
      minutes = new Decimal(15);
    } else if (minutes.lessThanOrEqualTo(37)) {
      minutes = new Decimal(30);
    } else if (minutes.lessThanOrEqualTo(52)) {
      minutes = new Decimal(45);
    } else {
      toFormatHours = toFormatHours.plus(1);
      minutes = new Decimal(0);
    }

    const formattedHours = formatNumber(toFormatHours);
    const formattedMinutes = formatNumber(minutes);
    time = `${formattedHours}:${formattedMinutes}`;
  } else {
    const formattedHours = formatNumber(toFormatHours);
    time = `${formattedHours}:00`;
  }

  if (time !== '00:00') {
    result.push(time);
  }

  const str = join(' ', result);

  if (str === '') {
    return '-';
  }

  return str;
};

const dateToHours = (date: Date): Decimal => {
  let totalHours = new Decimal(0);

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
