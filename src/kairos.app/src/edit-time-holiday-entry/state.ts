import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

export interface EditTimeHolidayEntryState {
  timeHolidayEntry: TimeHolidayEntryModel;

  ui: {
    busy: {
      getTimeHolidayEntry: boolean;
      updateTimeHolidayEntry: boolean;
    };
  };
}

export const editTimeHolidayEntryInitialState: EditTimeHolidayEntryState = {
  timeHolidayEntry: TimeHolidayEntryModel.empty,

  ui: {
    busy: {
      getTimeHolidayEntry: false,
      updateTimeHolidayEntry: false,
    },
  },
};
