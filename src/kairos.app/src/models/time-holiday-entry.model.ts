import { parseISO } from 'date-fns';

import { UUID } from './uuid.model';
import { immerable } from 'immer';

export class TimeHolidayEntryModel {
  [immerable] = true;

  constructor(public id = UUID.Generate(), public description = '', public when = new Date()) {}

  static fromOutModel(outModel: TimeHolidayEntryOutModel) {
    return new TimeHolidayEntryModel(
      new UUID(outModel.id),
      outModel.description,
      parseISO(outModel.when),
    );
  }

  static empty: TimeHolidayEntryModel = new TimeHolidayEntryModel(new UUID(), '', new Date(0));

  isEmpty() {
    return (
      this.id.equals(TimeHolidayEntryModel.empty.id) &&
      this.description === TimeHolidayEntryModel.empty.description &&
      this.when === TimeHolidayEntryModel.empty.when
    );
  }
}

export interface TimeHolidayEntryOutModel {
  id: string;
  description: string;
  when: string;
}
