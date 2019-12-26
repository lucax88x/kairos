import { TimeAbsenceEntryListModel } from './time-absence-entry-list.model';
import { TimeEntryListModel } from './time-entry-list.model';
import { TimeHolidayEntryModel } from './time-holiday-entry.model';

export type EntryModel =
  | TimeEntryListModel
  | TimeAbsenceEntryListModel
  | TimeHolidayEntryModel;
