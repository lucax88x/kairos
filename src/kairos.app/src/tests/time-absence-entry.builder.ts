import { JobListModel } from '../models/job.model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

export class TimeAbsenceEntryBuilder {
  private jobId = UUID.Generate();
  private start = '';
  private end = '';
  private type = TimeAbsenceEntryTypes.COMPENSATION;

  withJob(jobId: UUID): TimeAbsenceEntryBuilder {
    this.jobId = jobId;
    return this;
  }

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
    return new TimeAbsenceEntryListModel(
      UUID.Generate(),
      '',
      new Date(this.start),
      new Date(this.end),
      this.type,
      new JobListModel(this.jobId, ''),
    );
  }
}
