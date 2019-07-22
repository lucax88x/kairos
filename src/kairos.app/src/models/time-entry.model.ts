import { parseISO } from 'date-fns';

import { UUID } from './uuid.model';

export enum TimeEntryTypes {
  IN = 'IN',
  OUT = 'OUT',
}

export class TimeEntryModel {
  constructor(
    public id = UUID.Generate(),
    public when = new Date(),
    public type = TimeEntryTypes.IN,
  ) {}

  static fromOutModel(outModel: TimeEntryOutModel) {
    return new TimeEntryModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      TimeEntryTypes[outModel.type],
    );
  }

  static empty: TimeEntryModel = new TimeEntryModel(new UUID(), new Date(0));

  isEmpty() {
    return this.id !== TimeEntryModel.empty.id && this.when !== TimeEntryModel.empty.when;
  }
}

export interface TimeEntryOutModel {
  id: string;
  when: string;
  type: TimeEntryTypes;
}
