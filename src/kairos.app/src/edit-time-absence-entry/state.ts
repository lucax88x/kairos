import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';

export interface EditTimeAbsenceEntryState {
  timeAbsenceEntry: TimeAbsenceEntryModel;

  ui: {
    busy: {
      getTimeAbsenceEntry: boolean;
      updateTimeAbsenceEntry: boolean;
    };
  };
}

export const editTimeAbsenceEntryInitialState: EditTimeAbsenceEntryState = {
  timeAbsenceEntry: TimeAbsenceEntryModel.empty,

  ui: {
    busy: {
      getTimeAbsenceEntry: false,
      updateTimeAbsenceEntry: false,
    },
  },
};
