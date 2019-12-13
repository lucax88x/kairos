import { immerable } from 'immer';
import { map } from 'ramda';
import { JobModel, JobOutModel } from './job.model';
import { UUID } from './uuid.model';

export class ProfileModel {
  [immerable] = true;

  constructor(public id = UUID.Generate(), public jobs: JobModel[]) {}

  static fromOutModel(outModel: ProfileOutModel) {
    return new ProfileModel(new UUID(outModel.id), map(JobModel.fromOutModel, outModel.jobs));
  }

  static empty: ProfileModel = new ProfileModel(new UUID(), []);

  isEmpty() {
    return UUID.equals(this.id, ProfileModel.empty.id);
  }
}
export interface ProfileOutModel {
  id: string;
  jobs: JobOutModel[];
}
