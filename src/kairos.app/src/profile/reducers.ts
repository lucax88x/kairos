import { reduce } from 'ramda';

import { ProfileActions } from '../actions';
import { getProfileReducer } from './get-profile';
import { profileInitialState, ProfileState } from './state';
import { updateProfileReducer } from './update-profile';

const reducers = [getProfileReducer, updateProfileReducer];

export const profileReducers = (
  state = profileInitialState,
  action: ProfileActions,
): ProfileState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
