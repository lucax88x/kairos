import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectUser } from '../auth/selectors';
import { ProfileModel } from '../models/profile.model';
import { selectSelectedLanguage, selectIsOnline } from '../shared/selectors';
import { State } from '../state';
import { ProfileComponent, ProfileDispatches, ProfileInputs } from './Profile';
import {
  selectIsGetProfileBusy,
  selectIsUpdateProfileBusy,
  selectProfile,
} from './selectors';
import { updateProfileAsync } from './update-profile';

const mapStateToProps = (state: State): ProfileInputs => ({
  isOnline: selectIsOnline(state),
  selectedLanguage: selectSelectedLanguage(state),
  user: selectUser(state),
  profile: selectProfile(state),
  isGetBusy: selectIsGetProfileBusy(state),
  isUpdateBusy: selectIsUpdateProfileBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): ProfileDispatches => ({
  onUpdate: (model: ProfileModel) =>
    dispatch(updateProfileAsync.request({ model })),
});

export const Profile = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileComponent);
