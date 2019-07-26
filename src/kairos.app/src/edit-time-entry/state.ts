import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryModel } from '../models/time-entry.model';

export interface EditTimeEntryState {
  timeEntry: TimeEntryModel;
  timeAbsenceEntry: TimeAbsenceEntryModel;

  ui: {
    busy: {
      getTimeEntry: boolean;
      updateTimeEntry: boolean;
      getTimeAbsenceEntry: boolean;
      updateTimeAbsenceEntry: boolean;
    };
  };
}

export const editTimeEntryInitialState: EditTimeEntryState = {
  timeEntry: TimeEntryModel.empty,
  timeAbsenceEntry: TimeAbsenceEntryModel.empty,

  ui: {
    busy: {
      getTimeEntry: false,
      updateTimeEntry: false,
      getTimeAbsenceEntry: false,
      updateTimeAbsenceEntry: false,
    },
  },
};
