import { TimeEntryModel } from '../models/time-entry.model';

export interface DashboardState {
  timeEntries: TimeEntryModel[];

  ui: {
    busy: {
      getTimeEntries: boolean;
    };
  };
}

export const dashboardInitialState: DashboardState = {
  timeEntries: [],

  ui: {
    busy: {
      getTimeEntries: false,
    },
  },
};
