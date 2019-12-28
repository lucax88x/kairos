import { humanDifferenceFromHours } from './humanDifference';

describe('humanDifference', () => {
  test.each`
    hours | expected
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
      expect(humanDifferenceFromHours(hours)).toBe(expected);
    },
  );  

  test.each`
    hours   | expected
    ${0.5}  | ${'00:30'}
    ${10}   | ${'01wd 02:00'}
    ${6}    | ${'06:00'}
    ${6.5}  | ${'06:30'}
    ${24}   | ${'03wd'}
    ${112}  | ${'14wd'}
  `(
    'returns $expected when we get human hours of $hours relative to working day',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(hours, 8)).toBe(expected);
    },
  );
  
  test.each`
    hours   | expected
    ${0.3}  | ${'00:15'}
    ${0.4}  | ${'00:30'}
    ${0.6}  | ${'00:30'}
    ${0.7}  | ${'00:45'}
    ${0.8}  | ${'00:45'}
    ${0.9}  | ${'01:00'}
    ${1.3}  | ${'01:15'}
    ${1.4}  | ${'01:30'}
    ${1.6}  | ${'01:30'}
    ${1.7}  | ${'01:45'}
    ${1.8}  | ${'01:45'}
    ${1.9}  | ${'02:00'}
  `(
    'returns $expected rounded to nearest 15th minutes',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(hours, 8)).toBe(expected);
    },
  );
});
