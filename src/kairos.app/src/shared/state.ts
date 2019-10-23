import { getYear } from 'date-fns';
import { CountryModel } from '../models/country.model';
import { Language } from '../models/language-model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

export interface SharedState {
  selectedLanguage: Language;
  selectedYear: number;
  countries: CountryModel[];
  timeEntries: TimeEntryListModel[];
  timeAbsenceEntries: TimeAbsenceEntryModel[];
  timeHolidayEntries: TimeHolidayEntryModel[];

  ui: {
    busy: {
      getCountries: boolean;
      getTimeEntries: boolean;
      createTimeEntry: boolean;
      deleteTimeEntries: boolean;
      getTimeAbsenceEntries: boolean;
      createTimeAbsenceEntry: boolean;
      deleteTimeAbsenceEntries: boolean;
      getTimeHolidayEntries: boolean;
      createTimeHolidayEntry: boolean;
      deleteTimeHolidayEntries: boolean;
      updateTimeHolidayEntriesByCountry: boolean;
    };
    modal: {
      confirmation: boolean;
    };
    confirmation: {
      title: string | null;
      message: string | null;
      approveButton: string | null;
      rejectButton: string | null;
    };
  };
}

export const sharedInitialState: SharedState = {
  selectedLanguage: getBrowserLanguage(),
  selectedYear: getYear(new Date()),
  countries: [],
  timeEntries: [],
  timeAbsenceEntries: [],
  timeHolidayEntries: [],

  ui: {
    busy: {
      getCountries: false,
      getTimeEntries: false,
      createTimeEntry: false,
      deleteTimeEntries: false,
      getTimeAbsenceEntries: false,
      createTimeAbsenceEntry: false,
      deleteTimeAbsenceEntries: false,
      getTimeHolidayEntries: false,
      createTimeHolidayEntry: false,
      deleteTimeHolidayEntries: false,
      updateTimeHolidayEntriesByCountry: false,
    },
    modal: {
      confirmation: false,
    },
    confirmation: {
      title: null,
      message: null,
      approveButton: null,
      rejectButton: null,
    },
  },
};

function getBrowserLanguage(): Language {
  // tslint:disable-next-line: no-any
  const browserLanguage = navigator.language || (navigator as any).userLanguage;

  // TODO: find some utility to convert from culture to language safely
  switch (browserLanguage) {
    case 'it-IT':
    case 'it-CH':
    case 'it':
      return 'it';
    default:
    case 'en-US':
    case 'en-UK':
    case 'en':
      return 'en';
  }
}
