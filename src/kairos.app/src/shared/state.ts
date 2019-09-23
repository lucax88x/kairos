import { CountryModel } from '../models/country.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

export interface SharedState {
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
      deleteTimeEntry: boolean;
      getTimeAbsenceEntries: boolean;
      createTimeAbsenceEntry: boolean;
      deleteTimeAbsenceEntry: boolean;
      getTimeHolidayEntries: boolean;
      createTimeHolidayEntry: boolean;
      deleteTimeHolidayEntry: boolean;
      updateTimeHolidayEntriesByCountry: boolean;
    };
  };
}

export const sharedInitialState: SharedState = {
  selectedYear: 2019,
  countries: [],
  timeEntries: [],
  timeAbsenceEntries: [],
  timeHolidayEntries: [],

  ui: {
    busy: {
      getCountries: false,
      getTimeEntries: false,
      createTimeEntry: false,
      deleteTimeEntry: false,
      getTimeAbsenceEntries: false,
      createTimeAbsenceEntry: false,
      deleteTimeAbsenceEntry: false,
      getTimeHolidayEntries: false,
      createTimeHolidayEntry: false,
      deleteTimeHolidayEntry: false,
      updateTimeHolidayEntriesByCountry: false,
    },
  },
};
