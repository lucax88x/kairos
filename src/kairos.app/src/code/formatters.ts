import { format, Locale, isValid } from 'date-fns';
import { enGB, it } from 'date-fns/locale';
import { Language } from '../models/language-model';
import { getTextFromAbsenceType, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { getTextFromEntryType, TimeEntryTypes } from '../models/time-entry.model';
import { formatAsDate, formatAsDateTime } from './constants';
import { isString } from './is';
import { i18n } from '../i18nLoader';
import { t } from '@lingui/macro';

export const dateFormatterLocales: { [key: string]: Locale } = { ['en']: enGB, ['it']: it };

export const dateTimeFormatter = (date: Date | string) => {
  return formatDate(date, 'en', formatAsDateTime);
};
export const dateFormatter = (date: Date | string) => {
  return formatDate(date, 'en', formatAsDate);
};
export const entryTypeFormatter = (type: TimeEntryTypes) => getTextFromEntryType(type);
export const absenceTypeFormatter = (type: TimeAbsenceEntryTypes) => getTextFromAbsenceType(type);

export const formatDate = (
  date: Date | string,
  language: Language,
  dateFormat: string = formatAsDateTime,
) => {
  if (!isString(date)) {
    if (isValid(date)) {
      return format(date, dateFormat, { locale: dateFormatterLocales[language] });
    } else {
      return i18n._(t`Validation.InvalidDate`);
    }
  }

  return date;
};
