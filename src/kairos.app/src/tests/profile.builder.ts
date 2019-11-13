import { JobModel } from '../models/job.model';
import { UUID } from '../models/uuid.model';
import { ProfileModel } from './../models/profile.model';
export class ProfileBuilder {
  build(): ProfileModel {
    const profile = new ProfileModel(UUID.Generate(), [
      new JobModel(
        UUID.Generate(),
        'test-job',
        new Date('January 1 2019 00:00'),
        new Date('March 31 2019 23:59'),
        20,
        8,
        8,
        8,
        8,
        8,
        8,
        8,
      ),
    ]);
    return profile;
  }
}
