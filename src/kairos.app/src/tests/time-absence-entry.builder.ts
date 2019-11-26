import { TimeAbsenceEntryModel, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

export class TimeAbsenceEntryBuilder {
  private start = '';
  private end = '';
  private type = TimeAbsenceEntryTypes.COMPENSATION;

  withType(type: TimeAbsenceEntryTypes): TimeAbsenceEntryBuilder {
    this.type = type;
    return this;
  }

  withStart(date: string): TimeAbsenceEntryBuilder {
    this.start = date;
    return this;
  }

  withEnd(date: string): TimeAbsenceEntryBuilder {
    this.end = date;
    return this;
  }

  build() {
    return new TimeAbsenceEntryModel(
      UUID.Generate(),
      '',
      new Date(this.start),
      new Date(this.end),
      this.type,
    );
  }
}
