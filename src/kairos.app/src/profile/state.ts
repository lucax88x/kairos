import { ProfileModel } from '../models/profile.model';

export interface ProfileState {
  profile: ProfileModel;

  ui: {
    busy: {
      getProfile: boolean;
      updateProfile: boolean;
    };
  };
}

export const profileInitialState: ProfileState = {
  profile: ProfileModel.empty,

  ui: {
    busy: {
      getProfile: false,
      updateProfile: false,
    },
  },
};
