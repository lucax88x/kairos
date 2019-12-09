import { is, contains } from 'ramda';
import { Language, Languages } from '../models/language-model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';

export function isString(obj: unknown): obj is string {
  return is(String, obj);
}
export function isNumber(obj: unknown): obj is number {
  return is(Number, obj);
}
export function isLanguage(obj: unknown): obj is Language {
  return contains(obj, Languages);
}
// tslint:disable-next-line: no-any
export function isTimeEntryListModel(obj: any): obj is TimeEntryListModel {
  return 'type' in obj && 'when' in obj;
}

export function isTimeAbsenceEntryModel(
  // tslint:disable-next-line: no-any
  obj: any,
): obj is TimeAbsenceEntryModel {
  return 'description' in obj && 'start' in obj && 'end' in obj;
}

export function isTimeHolidayEntryModel(
  // tslint:disable-next-line: no-any
  obj: any,
): obj is TimeHolidayEntryModel {
  return 'description' in obj && 'when' in obj;
}
