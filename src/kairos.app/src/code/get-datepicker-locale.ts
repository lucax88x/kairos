import enLocale from 'date-fns/locale/en-US';
import itLocale from 'date-fns/locale/it';
import { Language } from '../models/language-model';

export function getDatepickerLocale(language: Language) {
  switch (language) {
    case 'it':
      return itLocale;
    default:
    case 'en':
      return enLocale;
  }
}
