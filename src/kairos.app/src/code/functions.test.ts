import { getHumanHours } from './functions';

test.each`
  hours   | expected
  ${1}    | ${'01'}
  ${1.5}  | ${'01:30'}
  ${2}    | ${'02'}
  ${8.45} | ${'08:27'}
  ${8.1} | ${'08:06'}
  ${25}   | ${'25'}
`(
  'returns $expected when we get human hours of $hours',
  ({ hours, expected }) => {
    // given
    expect(getHumanHours(hours)).toBe(expected);
  },
);
