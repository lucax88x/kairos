import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import { JobListModel, JobListOutModel } from './job.model';
import { TimeEntryTypes } from './time-entry.model';
import { UUID } from './uuid.model';

export class TimeEntryListModel {
  [immerable] = true;

  constructor(
    public id: UUID,
    public when: Date,
    public type: TimeEntryTypes,
    public job: JobListModel,
  ) {}

  static fromOutModel(outModel: TimeEntryListOutModel) {
    return new TimeEntryListModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      TimeEntryTypes[outModel.type],
      JobListModel.fromOutModel(outModel.job),
    );
  }

  static empty: TimeEntryListModel = new TimeEntryListModel(
    new UUID(),
    new Date(0),
    TimeEntryTypes.IN,
    JobListModel.empty,
  );

  static isEmpty(model: TimeEntryListModel) {
    return (
      UUID.isEmpty(model.id) &&
      model.when === TimeEntryListModel.empty.when &&
      JobListModel.isEmpty(model.job)
    );
  }
}

export interface TimeEntryListOutModel {
  id: string;
  when: string;
  type: TimeEntryTypes;
  job: JobListOutModel;
}
