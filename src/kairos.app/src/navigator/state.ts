import { endOfDay, startOfDay } from 'date-fns';
import { EntryModel } from '../models/entry-list-model';

export interface NavigatorState {
  startDate: Date;
  endDate: Date;
  entries: EntryModel[];

  ui: {
    busy: {
      getEntries: boolean;
    };
  };
}

export const navigatorInitialState: NavigatorState = {
  startDate: startOfDay(new Date()),
  endDate: endOfDay(new Date()),
  entries: [],

  ui: {
    busy: {
      getEntries: false,
    },
  },
};
