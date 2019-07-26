import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryModel } from '../models/time-entry.model';

export interface DashboardState {
  timeEntries: TimeEntryModel[];
  timeAbsenceEntries: TimeAbsenceEntryModel[];

  ui: {
    busy: {
      getTimeEntries: boolean;
      getTimeAbsenceEntries: boolean;
    };
  };
}

export const dashboardInitialState: DashboardState = {
  timeEntries: [],
  timeAbsenceEntries: [],

  ui: {
    busy: {
      getTimeEntries: false,
      getTimeAbsenceEntries: false,
    },
  },
};
