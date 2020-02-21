import {
  humanDifferenceFromHours,
  humanDifference,
  formatHoursToTime,
  formatUnixToTime,
} from './humanDifference';
import { Decimal } from 'decimal.js';

describe('humanDifference', () => {
  test.each`
    hours   | expected
    ${1}    | ${'01:00'}
    ${1.5}  | ${'01:30'}
    ${2}    | ${'02:00'}
    ${8.45} | ${'08:30'}
    ${8.1}  | ${'08:00'}
    ${25}   | ${'01d 01:00'}
  `(
    'returns $expected when we get human hours of $hours',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(new Decimal(hours))).toBe(expected);
    },
  );

  test.each`
    hours  | expected
    ${0.5} | ${'00:30'}
    ${10}  | ${'01wd 02:00'}
    ${6}   | ${'06:00'}
    ${6.5} | ${'06:30'}
    ${24}  | ${'03wd'}
    ${112} | ${'14wd'}
  `(
    'returns $expected when we get human hours of $hours relative to working day',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(new Decimal(hours), new Decimal(8))).toBe(
        expected,
      );
    },
  );

  test.each`
    hours  | expected
    ${0.3} | ${'00:15'}
    ${0.4} | ${'00:30'}
    ${0.6} | ${'00:30'}
    ${0.7} | ${'00:45'}
    ${0.8} | ${'00:45'}
    ${0.9} | ${'01:00'}
    ${1.3} | ${'01:15'}
    ${1.4} | ${'01:30'}
    ${1.6} | ${'01:30'}
    ${1.7} | ${'01:45'}
    ${1.8} | ${'01:45'}
    ${1.9} | ${'02:00'}
  `(
    'returns $expected rounded to nearest 15th minutes',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(new Decimal(hours), new Decimal(8))).toBe(
        expected,
      );
    },
  );

  test.each`
    hours  | expected
    ${0.3} | ${'00:15'}
    ${0.4} | ${'00:30'}
    ${0.6} | ${'00:30'}
    ${0.7} | ${'00:45'}
    ${0.8} | ${'00:45'}
    ${0.9} | ${'01:00'}
    ${1.3} | ${'01:15'}
    ${1.4} | ${'01:30'}
    ${1.6} | ${'01:30'}
    ${1.7} | ${'01:45'}
    ${1.8} | ${'01:45'}
    ${1.9} | ${'02:00'}
  `(
    'returns $expected rounded to nearest 15th minutes',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(new Decimal(hours), new Decimal(8))).toBe(
        expected,
      );
    },
  );

  test.each`
    start                        | end                          | expected
    ${'January 1 2019 00:00:00'} | ${'January 2 2019 00:00:00'} | ${'01d'}
    ${'January 1 2019 00:00:00'} | ${'January 1 2019 06:00:00'} | ${'06:00'}
    ${'January 1 2019 00:00:00'} | ${'January 2 2019 06:00:00'} | ${'01d 06:00'}
    ${'January 1 2019 00:00:00'} | ${'January 5 2019 00:00:00'} | ${'04d'}
    ${'January 2 2019 00:00:00'} | ${'January 1 2019 00:00:00'} | ${'-01d'}
  `(
    'returns $start-$end producing $expected',
    ({ start, end, expected }) => {
      // given
      expect(humanDifference(new Date(start), new Date(end))).toBe(expected);
    },
  );
});
