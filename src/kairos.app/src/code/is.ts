import { is } from 'ramda';

export function isString(obj: unknown): obj is string {
  return is(String, obj);
}
export function isNumber(obj: unknown): obj is number {
  return is(Number, obj);
}
