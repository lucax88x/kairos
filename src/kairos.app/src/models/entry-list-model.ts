import { TimeAbsenceEntryModel } from './time-absence-entry.model';
import { TimeEntryListModel } from './time-entry-list.model';
import { TimeHolidayEntryModel } from './time-holiday-entry.model';

export type EntryModel =
  | TimeEntryListModel
  | TimeAbsenceEntryModel
  | TimeHolidayEntryModel;
