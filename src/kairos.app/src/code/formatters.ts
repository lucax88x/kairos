import { format, Locale } from 'date-fns';
import { enGB, it } from 'date-fns/locale';
import { getTextFromAbsenceType, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { getTextFromEntryType, TimeEntryTypes } from '../models/time-entry.model';
import { formatAsDateTime } from './constants';
import { isString } from './is';
import { Language } from '../models/language-model';

const locales: { [key: string]: Locale } = { ['en']: enGB, ['it']: it };

export const dateTimeFormatter = (date: Date | string) => {
  return formatDate(date, 'en', formatAsDateTime);
};
export const entryTypeFormatter = (type: TimeEntryTypes) => getTextFromEntryType(type);
export const absenceTypeFormatter = (type: TimeAbsenceEntryTypes) => getTextFromAbsenceType(type);

export const formatDate = (
  date: Date | string,
  language: Language,
  dateFormat: string = formatAsDateTime,
) => {
  if (!isString(date)) {
    return format(date, dateFormat, { locale: locales[language] });
  }

  return date;
};
