import { TimeEntryModel } from '../models/time-entry.model';

export interface DashboardState {
  timeEntries: TimeEntryModel[];

  ui: {
    busy: {
      timeEntries: boolean;
    };
  };
}

export const dashboardInitialState: DashboardState = {
  timeEntries: [],

  ui: {
    busy: {
      timeEntries: false,
    },
  },
};
