import { Themes } from './variables';

it('with 0 should get first with 5 colors', () => {
  // when
  const result = Themes.getRelativeToIndex(0);

  // then
  expect(result).toBe(Themes.First);
});

it('with 1 should get second with 5 colors', () => {
  // when
  const result = Themes.getRelativeToIndex(1);

  // then
  expect(result).toBe(Themes.Second);
});

it('with 4 should get 5th with 5 colors', () => {
  // when
  const result = Themes.getRelativeToIndex(4);

  // then
  expect(result).toBe(Themes.Fifth);
});

it('with 5 should get first with 5 colors', () => {
  // when
  const result = Themes.getRelativeToIndex(5);

  // then
  expect(result).toBe(Themes.First);
});
