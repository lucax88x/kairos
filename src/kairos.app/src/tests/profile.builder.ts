import { JobModel } from '../models/job.model';
import { UUID } from '../models/uuid.model';
import { ProfileModel } from './../models/profile.model';
export class ProfileBuilder {
  private id = UUID.Generate();
  withJob(id: UUID) {
    this.id = id;
    return this;
  }
  build(): ProfileModel {
    const profile = new ProfileModel(UUID.Generate(), [
      new JobModel(
        this.id,
        'test-job',
        new Date('January 1 2019 00:00'),
        new Date('March 31 2019 23:59'),
        20,
        8.5,
        8.5,
        8.5,
        8.5,
        8.5,
        0,
        0,
      ),
    ]);
    return profile;
  }
}
