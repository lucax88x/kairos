import { parseISO } from 'date-fns';
import { TimeEntryTypes } from './time-entry.model';
import { UUID } from './uuid.model';
import { immerable } from 'immer';

export class TimeEntryListProjectModel {
  constructor(public name: string) {}
  static fromOutModel(outModel: TimeEntryListProjectOutModel) {
    return new TimeEntryListProjectModel(outModel.name);
  }

  static empty = new TimeEntryListProjectModel('');

  isEmpty() {
    return !!this.name;
  }
}

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
    public project: TimeEntryListProjectModel,
  ) {}

  static fromOutModel(outModel: TimeEntryListOutModel) {
    return new TimeEntryListModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      TimeEntryTypes[outModel.type],
      TimeEntryListJobModel.fromOutModel(outModel.job),
      TimeEntryListProjectModel.fromOutModel(outModel.project),
    );
  }

  static empty: TimeEntryListModel = new TimeEntryListModel(
    new UUID(),
    new Date(0),
    TimeEntryTypes.IN,
    TimeEntryListJobModel.empty,
    TimeEntryListProjectModel.empty,
  );

  isEmpty() {
    return (
      this.id.equals(TimeEntryListModel.empty.id) &&
      this.when === TimeEntryListModel.empty.when &&
      this.job.isEmpty() &&
      this.project.isEmpty()
    );
  }
}

export interface TimeEntryListOutModel {
  id: string;
  when: string;
  type: TimeEntryTypes;
  job: TimeEntryListJobOutModel;
  project: TimeEntryListProjectOutModel;
}

export interface TimeEntryListJobOutModel {
  name: string;
}

export interface TimeEntryListProjectOutModel {
  name: string;
}
