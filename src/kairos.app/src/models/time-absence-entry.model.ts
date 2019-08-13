import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { UUID } from './uuid.model';


export enum TimeAbsenceEntryTypes {
  VACATION = 'VACATION',
  ILLNESS = 'ILLNESS',
}

export class TimeAbsenceEntryModel {
  constructor(
    public id = UUID.Generate(),
    public description = '',
    public start = startOfDay(new Date()),
    public end = endOfDay(new Date()),
    public type = TimeAbsenceEntryTypes.VACATION,
  ) {}

  static fromOutModel(outModel: TimeAbsenceEntryOutModel) {
    return new TimeAbsenceEntryModel(
      new UUID(outModel.id),
      outModel.description,
      parseISO(outModel.start),
      parseISO(outModel.end),
      TimeAbsenceEntryTypes[outModel.type],
    );
  }

  static empty: TimeAbsenceEntryModel = new TimeAbsenceEntryModel(
    new UUID(),
    '',
    new Date(0),
    new Date(0),
  );

  isEmpty() {
    return (
      this.id.equals(TimeAbsenceEntryModel.empty.id) &&
      this.description === TimeAbsenceEntryModel.empty.description &&
      this.start === TimeAbsenceEntryModel.empty.start &&
      this.end === TimeAbsenceEntryModel.empty.end
    );
  }
}

export interface TimeAbsenceEntryOutModel {
  id: string;
  description: string;
  start: string;
  end: string;
  type: TimeAbsenceEntryTypes;
}
