import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';

export class TimeHolidayEntryBuilder {
  private when = '';

  withWhen(when: string): TimeHolidayEntryBuilder {
    this.when = when;
    return this;
  }

  build() {
    return new TimeHolidayEntryModel(UUID.Generate(), '', new Date(this.when));
  }
}
