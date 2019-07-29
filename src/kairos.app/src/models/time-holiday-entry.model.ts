import { parseISO } from 'date-fns';

import { UUID } from './uuid.model';

export class TimeHolidayEntryModel {
  constructor(public id = UUID.Generate(), public when = new Date()) {}

  static fromOutModel(outModel: TimeHolidayEntryOutModel) {
    return new TimeHolidayEntryModel(new UUID(outModel.id), parseISO(outModel.when));
  }

  static empty: TimeHolidayEntryModel = new TimeHolidayEntryModel(new UUID(), new Date(0));

  isEmpty() {
    return (
      this.id === TimeHolidayEntryModel.empty.id && this.when === TimeHolidayEntryModel.empty.when
    );
  }
}

export interface TimeHolidayEntryOutModel {
  id: string;
  when: string;
}
