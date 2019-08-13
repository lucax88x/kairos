import { parseISO } from 'date-fns';

import { UUID } from './uuid.model';

export class TimeHolidayEntryModel {
  constructor(
    public id = UUID.Generate(),
    public description = '',
    public start = new Date(),
    public end = new Date(),
  ) {}

  static fromOutModel(outModel: TimeHolidayEntryOutModel) {
    return new TimeHolidayEntryModel(
      new UUID(outModel.id),
      outModel.description,
      parseISO(outModel.start),
      parseISO(outModel.end),
    );
  }

  static empty: TimeHolidayEntryModel = new TimeHolidayEntryModel(
    new UUID(),
    '',
    new Date(0),
    new Date(0),
  );

  isEmpty() {
    return (
      this.id.equals(TimeHolidayEntryModel.empty.id) &&
      this.description === TimeHolidayEntryModel.empty.description &&
      this.start === TimeHolidayEntryModel.empty.start &&
      this.end === TimeHolidayEntryModel.empty.end
    );
  }
}

export interface TimeHolidayEntryOutModel {
  id: string;
  description: string;
  start: string;
  end: string;
}
