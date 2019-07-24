import { UserModel } from '../models/user.model';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserModel;

  ui: {
    busy: {
      auth: boolean;
      login: boolean;
      logout: boolean;
    };
  };
}

export const authInitialState: AuthState = {
  isAuthenticated: false,
  user: UserModel.empty,

  ui: {
    busy: {
      auth: false,
      login: false,
      logout: false,
    },
  },
};
