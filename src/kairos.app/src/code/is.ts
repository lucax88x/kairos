import { is, contains } from 'ramda';
import { Language, Languages } from '../models/language-model';

export function isString(obj: unknown): obj is string {
  return is(String, obj);
}
export function isNumber(obj: unknown): obj is number {
  return is(Number, obj);
}
export function isLanguage(obj: unknown): obj is Language {
  return contains(obj, Languages)
}
