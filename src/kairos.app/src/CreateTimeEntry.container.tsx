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
import { selectIsCreateTimeEntryBusy, selectSelectedLanguage } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): CreateTimeEntryInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  profile: selectProfile(state),
  isBusy: selectIsCreateTimeEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): CreateTimeEntryDispatches => ({
  onCreate: (model: TimeEntryModel) => dispatch(createTimeEntryAsync.request(model)),
});

export const CreateTimeEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTimeEntryComponent);
