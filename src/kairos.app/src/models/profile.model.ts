import { map } from 'ramda';

import { JobModel, JobOutModel } from './job.model';
import { UUID } from './uuid.model';

export class ProfileModel {
  constructor(public id = UUID.Generate(), public jobs: JobModel[]) {}

  static fromOutModel(outModel: ProfileOutModel) {
    return new ProfileModel(new UUID(outModel.id), map(JobModel.fromOutModel, outModel.jobs));
  }

  static empty: ProfileModel = new ProfileModel(new UUID(), []);

  isEmpty() {
    return this.id.equals(ProfileModel.empty.id);
  }
}
export interface ProfileOutModel {
  id: string;
  jobs: JobOutModel[];
}
