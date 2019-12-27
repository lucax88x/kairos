import { humanDifferenceFromHours } from './humanDifference';

describe('humanDifference', () => {
  test.each`
    hours | expected
    ${1}    | ${'01:00'}
    ${1.5}  | ${'01:30'}
    ${2}    | ${'02:00'}
    ${8.45} | ${'08:26'}
    ${8.1}  | ${'08:05'}
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
    ${0.5}  | ${'00:29'}
    ${10}   | ${'01wd 02:00'}
    ${6}    | ${'06:00'}
    ${6.5}  | ${'06:29'} // to be fixed
    ${24}   | ${'03wd'}
    ${112}  | ${'14wd'}
  `(
    'returns $expected when we get human hours of $hours relative to working day',
    ({ hours, expected }) => {
      // given
      expect(humanDifferenceFromHours(hours, 8)).toBe(expected);
    },
  );
});
