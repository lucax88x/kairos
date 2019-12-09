import { getHumanHours } from './functions';

test.each`
  hours | expected
  ${1}  | ${'1'}
  ${1.5}  | ${'1:30'}
  ${2}  | ${'2'}
  ${8.45}  | ${'8:27'}
  ${25}  | ${'25'}
`(
  'returns $expected when we get human hours of $hours',
  ({ hours, expected }) => {
    // given
    expect(getHumanHours(hours)).toBe(expected);
  },
);
