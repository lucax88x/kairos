import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import { TimeEntryTypes } from './time-entry.model';
import { UUID } from './uuid.model';

export class TimeEntryListJobModel {
  constructor(public id: UUID, public name: string) {}
  static fromOutModel(outModel: TimeEntryListJobOutModel) {
    return new TimeEntryListJobModel(new UUID(outModel.id), outModel.name);
  }

  static empty = new TimeEntryListJobModel(new UUID(), '');

  static isEmpty(model: TimeEntryListJobModel) {
    return UUID.isEmpty(model.id) && !model.name;
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

  static isEmpty(model: TimeEntryListModel) {
    return (
      UUID.isEmpty(model.id) &&
      model.when === TimeEntryListModel.empty.when &&
      TimeEntryListJobModel.isEmpty(model.job)
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
  id: string;
  name: string;
}
