import { is } from 'ramda';

export function isString(obj: any): obj is string {
  return is(String, obj);
}
