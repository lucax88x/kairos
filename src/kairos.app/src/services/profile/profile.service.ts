import { ProfileModel, ProfileOutModel } from '../../models/profile.model';
import { mutation, query } from '../graphql.service';
import { updateProfileMutation } from './mutations/update-profile';
import { getProfileQuery } from './queries/get-profile';

export async function getProfile() {
  const result = await query<{ userProfile: ProfileOutModel }>(getProfileQuery);

  return ProfileModel.fromOutModel(result.userProfile);
}

export async function updateProfile(model: ProfileModel) {
  await mutation(updateProfileMutation, { userProfile: model });
}
