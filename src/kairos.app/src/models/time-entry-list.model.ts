import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import { TimeEntryTypes } from './time-entry.model';
import { UUID } from './uuid.model';

export class TimeEntryListJobModel {
  constructor(public name: string) {}
  static fromOutModel(outModel: TimeEntryListJobOutModel) {
    return new TimeEntryListJobModel(outModel.name);
  }

  static empty = new TimeEntryListJobModel('');

  isEmpty() {
    return !!this.name;
  }
}

export class TimeEntryListModel {
  [immerable] = true;

  constructor(
    public id: UUID,
    public when: Date,
    public type: TimeEntryTypes,
    public job: TimeEntryListJobModel,
  ) {}

  static fromOutModel(outModel: TimeEntryListOutModel) {
    return new TimeEntryListModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      TimeEntryTypes[outModel.type],
      TimeEntryListJobModel.fromOutModel(outModel.job),
    );
  }

  static empty: TimeEntryListModel = new TimeEntryListModel(
    new UUID(),
    new Date(0),
    TimeEntryTypes.IN,
    TimeEntryListJobModel.empty,
  );

  isEmpty() {
    return (
      this.id.equals(TimeEntryListModel.empty.id) &&
      this.when === TimeEntryListModel.empty.when &&
      this.job.isEmpty()
    );
  }
}

export interface TimeEntryListOutModel {
  id: string;
  when: string;
  type: TimeEntryTypes;
  job: TimeEntryListJobOutModel;
}

export interface TimeEntryListJobOutModel {
  name: string;
}
