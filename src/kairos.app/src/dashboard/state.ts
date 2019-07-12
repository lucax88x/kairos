import { TimeEntryModel } from '../models/time-entry.model';

export interface DashboardState {
  timeEntries: TimeEntryModel[];
}

export const dashboardInitialState: DashboardState = {
  timeEntries: [],
};
