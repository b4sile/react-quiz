import { compareArrays, shuffle } from '.';

it('comparing arrays', () => {
  expect(compareArrays<string>(['a', 'b'], ['b', 'a'])).toBe(true);
  expect(compareArrays<string>([], [])).toBe(true);
  expect(compareArrays<string>(['a', 'b'], ['b', 'a', 'c'])).toBe(false);
  expect(compareArrays<string>(['a', 'b', 'c'], ['b', 'a', 'a'])).toBe(false);
  expect(compareArrays<string>(['a'], [])).toBe(false);
});

it('shuffle should return the same elements and the same length', () => {
  const arr = ['a', 'b', 'c'];
  expect(shuffle<string>(arr)).toHaveLength(3);
  expect(shuffle<string>([])).toHaveLength(0);
  expect(shuffle<string>(['a', 'b', 'c'])).toEqual(expect.arrayContaining(arr));
});
