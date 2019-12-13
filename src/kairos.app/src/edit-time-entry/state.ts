import { TimeEntryModel } from '../models/time-entry.model';

export interface EditTimeEntryState {
  timeEntry: TimeEntryModel;

  ui: {
    busy: {
      getTimeEntry: boolean;
      updateTimeEntry: boolean;
    };
  };
}

export const editTimeEntryInitialState: EditTimeEntryState = {
  timeEntry: TimeEntryModel.empty,

  ui: {
    busy: {
      getTimeEntry: false,
      updateTimeEntry: false,
    },
  },
};
