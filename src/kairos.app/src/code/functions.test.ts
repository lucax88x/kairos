import { humanDifferenceFromHours } from './functions';

test.each`
  hours   | expected
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
