import { parseISO } from 'date-fns';

import { UUID } from './uuid.model';

export enum TimeAbsenceEntryTypes {
  VACATION = 'VACATION',
  ILLNESS = 'ILLNESS',
}

export class TimeAbsenceEntryModel {
  constructor(
    public id = UUID.Generate(),
    public when = new Date(),
    public minutes = 0,
    public type = TimeAbsenceEntryTypes.VACATION,
  ) {}

  static fromOutModel(outModel: TimeAbsenceEntryOutModel) {
    return new TimeAbsenceEntryModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      outModel.minutes,
      TimeAbsenceEntryTypes[outModel.type],
    );
  }

  static empty: TimeAbsenceEntryModel = new TimeAbsenceEntryModel(new UUID(), new Date(0));

  isEmpty() {
    return this.id === TimeAbsenceEntryModel.empty.id && this.when === TimeAbsenceEntryModel.empty.when;
  }
}

export interface TimeAbsenceEntryOutModel {
  id: string;
  when: string;
  minutes: number;
  type: TimeAbsenceEntryTypes;
}
