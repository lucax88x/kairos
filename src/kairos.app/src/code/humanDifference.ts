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
  differenceInSeconds,
  differenceInYears,
  isAfter,
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

const HOURS_IN_DAY = new Decimal(24);
const MINUTES_IN_HOUR = new Decimal(60);
const SECONDS_IN_MINUTE = new Decimal(60);
const SECONDS_IN_HOUR = MINUTES_IN_HOUR.mul(SECONDS_IN_MINUTE);
const SECONDS_IN_DAY = SECONDS_IN_HOUR.mul(HOURS_IN_DAY);
const DAYS_IN_YEAR = new Decimal(365);
const SECONDS_IN_YEAR = SECONDS_IN_DAY.mul(DAYS_IN_YEAR);

export const humanDifference = (
  left: Date,
  right: Date,
  formatTimeOptions: FormatTimeOptions,
  relativeToHours = new Decimal(24),
) => {
  let difference: Date;
  let isPositive = true;
  if (isAfter(left, right)) {
    isPositive = false;
    difference = dateDifference(right, left);
  } else {
    isPositive = true;
    difference = dateDifference(left, right);
  }

  const totalHours = dateToHours(difference);
  const human = hoursToHuman(totalHours, formatTimeOptions, relativeToHours);
  return `${!isPositive ? '-' : ''}${human}`;
};

export const humanDifferenceFromHours = (
  hours: Decimal,
  formatTimeOptions: FormatTimeOptions,
  relativeToHours: Decimal = new Decimal(24),
) => {
  const percentualMinutes = hours.mod(1);
  hours = hours.minus(percentualMinutes);
  const minutes = new Decimal(60).mul(percentualMinutes);

  let date = new Date(0);

  date = addHours(date, hours.toNumber());
  date = addMinutes(date, minutes.toNumber());

  return humanDifference(new Date(0), date, formatTimeOptions, relativeToHours);
};

const formatNumber = (number: Decimal): string => {
  return padNumber(number.toNumber());
};

const hoursToHuman = (
  totalHours: Decimal,
  formatTimeOptions: FormatTimeOptions,
  relativeToHours = new Decimal(24),
) => {
  const result = [];
  const totalSeconds = totalHours.mul(SECONDS_IN_HOUR);

  const secondsInDay = SECONDS_IN_HOUR.mul(relativeToHours);
  const secondsInYear = secondsInDay.mul(DAYS_IN_YEAR);
  const years = totalSeconds.div(secondsInYear).floor();
  const days = totalSeconds
    .mod(secondsInYear)
    .div(secondsInDay)
    .floor();
  const hours = totalSeconds
    .mod(secondsInYear)
    .mod(secondsInDay)
    .div(SECONDS_IN_HOUR)
    .floor();
  const minutes = totalSeconds
    .mod(SECONDS_IN_YEAR)
    .mod(secondsInDay)
    .mod(SECONDS_IN_HOUR)
    .div(SECONDS_IN_MINUTE)
    .floor();

  // const numSeconds = totalSeconds
  //   .mod(SECONDS_IN_YEAR)
  //   .mod(SECONDS_IN_DAY)
  //   .mod(SECONDS_IN_HOUR)
  //   .mod(SECONDS_IN_MINUTE);

  if (years.greaterThanOrEqualTo(1)) {
    result.push(`${formatNumber(years)}y`);
  }
  if (days.greaterThanOrEqualTo(1)) {
    const suffix = relativeToHours.eq(HOURS_IN_DAY) ? 'd' : 'wd';
    result.push(`${formatNumber(days)}${suffix}`);
  }

  const time = formatTime(hours, minutes, formatTimeOptions);

  if (time !== '00:00') {
    result.push(time);
  }

  const str = join(' ', result);

  if (str === '') {
    return '-';
  }

  return str;
};

interface FormatTimeOptions {
  roundToNearest15: boolean;
}

function formatTime(
  hours: Decimal,
  minutes: Decimal,
  formatTimeOptions: FormatTimeOptions = { roundToNearest15: true },
) {
  let time = '00:00';
  if (minutes.greaterThanOrEqualTo(1)) {
    if (formatTimeOptions.roundToNearest15) {
      if (minutes.lessThanOrEqualTo(7)) {
        minutes = new Decimal(0);
      } else if (minutes.lessThanOrEqualTo(22)) {
        minutes = new Decimal(15);
      } else if (minutes.lessThanOrEqualTo(37)) {
        minutes = new Decimal(30);
      } else if (minutes.lessThanOrEqualTo(52)) {
        minutes = new Decimal(45);
      } else {
        hours = hours.plus(1);
        minutes = new Decimal(0);
      }
    }
    const formattedHours = formatNumber(hours);
    const formattedMinutes = formatNumber(minutes);
    time = `${formattedHours}:${formattedMinutes}`;
  } else {
    const formattedHours = formatNumber(hours);
    time = `${formattedHours}:00`;
  }
  return time;
}

export function formatUnixToTime(unix: number) {
  const totalSeconds = new Decimal(
    differenceInSeconds(new Date(unix), new Date(0)),
  );

  const hours = totalSeconds.div(SECONDS_IN_HOUR).floor();

  const minutes = totalSeconds
    .mod(SECONDS_IN_HOUR)
    .div(SECONDS_IN_MINUTE)
    .floor();

  return formatTime(hours, minutes);
}

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
