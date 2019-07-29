import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { TimeEntryModel } from '../models/time-entry.model';

export interface SharedState {
  timeEntries: TimeEntryModel[];
  timeAbsenceEntries: TimeAbsenceEntryModel[];
  timeHolidayEntries: TimeHolidayEntryModel[];

  ui: {
    busy: {
      getTimeEntries: boolean;
      createTimeEntry: boolean;
      deleteTimeEntry: boolean;
      getTimeAbsenceEntries: boolean;
      createTimeAbsenceEntry: boolean;
      deleteTimeAbsenceEntry: boolean;
      getTimeHolidayEntries: boolean;
      createTimeHolidayEntry: boolean;
      deleteTimeHolidayEntry: boolean;
    };
  };
}

export const sharedInitialState: SharedState = {
  timeEntries: [],
  timeAbsenceEntries: [],
  timeHolidayEntries: [],

  ui: {
    busy: {
      getTimeEntries: false,
      createTimeEntry: false,
      deleteTimeEntry: false,
      getTimeAbsenceEntries: false,
      createTimeAbsenceEntry: false,
      deleteTimeAbsenceEntry: false,
      getTimeHolidayEntries: false,
      createTimeHolidayEntry: false,
      deleteTimeHolidayEntry: false,
    },
  },
};
