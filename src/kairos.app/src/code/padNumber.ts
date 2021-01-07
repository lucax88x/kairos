export function padNumber(number: number, size = 2) {
  let s = number.toString();
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}
