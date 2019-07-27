import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryModel } from '../models/time-entry.model';

export interface SharedState {
  timeEntries: TimeEntryModel[];
  timeAbsenceEntries: TimeAbsenceEntryModel[];

  ui: {
    busy: {
      getTimeEntries: boolean;
      getTimeAbsenceEntries: boolean;
      createTimeEntry: boolean;
      deleteTimeEntry: boolean;
      createTimeAbsenceEntry: boolean;
      deleteTimeAbsenceEntry: boolean;
    };
  };
}

export const sharedInitialState: SharedState = {
  timeEntries: [],
  timeAbsenceEntries: [],

  ui: {
    busy: {
      getTimeEntries: false,
      getTimeAbsenceEntries: false,
      createTimeEntry: false,
      deleteTimeEntry: false,
      createTimeAbsenceEntry: false,
      deleteTimeAbsenceEntry: false,
    },
  },
};
