import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from './actions';
import {
  CreateTimeEntryComponent,
  CreateTimeEntryDispatches,
  CreateTimeEntryInputs,
} from './CreateTimeEntry';
import { TimeEntryModel } from './models/time-entry.model';
import { selectProfile } from './profile/selectors';
import { createTimeEntryAsync } from './shared/create-time-entry';
import {
  selectIsCreateTimeEntryAsInBusy,
  selectIsCreateTimeEntryAsOutBusy,
  selectIsOnline,
  selectSelectedLanguage,
} from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): CreateTimeEntryInputs => ({
  isOnline: selectIsOnline(state),
  selectedLanguage: selectSelectedLanguage(state),
  profile: selectProfile(state),
  isCreateAsInBusy: selectIsCreateTimeEntryAsInBusy(state),
  isCreateAsOutBusy: selectIsCreateTimeEntryAsOutBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): CreateTimeEntryDispatches => ({
  onCreate: (model: TimeEntryModel) =>
    dispatch(createTimeEntryAsync.request(model)),
});

export const CreateTimeEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTimeEntryComponent);
