import { TimeEntryListJobModel, TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';

export class TimeEntryBuilder {
  private jobId = UUID.Generate();
  private date = '';
  private type = TimeEntryTypes.IN;

  withJob(jobId: UUID): TimeEntryBuilder {
    this.jobId = jobId;
    return this;
  }

  withType(type: TimeEntryTypes): TimeEntryBuilder {
    this.type = type;
    return this;
  }

  withDate(date: string): TimeEntryBuilder {
    this.date = date;
    return this;
  }

  build() {
    return new TimeEntryListModel(
      UUID.Generate(),
      new Date(this.date),
      this.type,
      new TimeEntryListJobModel(this.jobId, '')
    );
  }
}
