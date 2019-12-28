/* eslint-disable @typescript-eslint/no-explicit-any */
import { contains, is } from 'ramda';
import { Language, Languages } from '../models/language-model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

export function isString(obj: unknown): obj is string {
  return is(String, obj);
}
export function isNumber(obj: unknown): obj is number {
  return is(Number, obj);
}
export function isBoolean(obj: unknown): obj is boolean {
  return is(Boolean, obj);
}
export function isLanguage(obj: unknown): obj is Language {
  return contains(obj, Languages);
}
export function isTimeEntryListModel(obj: any): obj is TimeEntryListModel {
  return 'type' in obj && 'when' in obj;
}

export function isTimeAbsenceEntryListModel(
  obj: any,
): obj is TimeAbsenceEntryListModel {
  return 'description' in obj && 'start' in obj && 'end' in obj;
}

export function isTimeHolidayEntryModel(
  obj: any,
): obj is TimeHolidayEntryModel {
  return 'description' in obj && 'when' in obj;
}
