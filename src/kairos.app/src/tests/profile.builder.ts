import { ProfileModel } from './../models/profile.model';
import { ProjectModel } from './../models/project.model';
import { UUID } from '../models/uuid.model';
import { JobModel } from '../models/job.model';
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
        [
          new ProjectModel(
            UUID.Generate(),
            'test-project',
            new Date('January 1 2019 00:00'),
            new Date('March 31 2019 23:59'),
            100,
          ),
        ],
      ),
    ]);
    return profile;
  }
}
