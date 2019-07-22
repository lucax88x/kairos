import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from './actions';
import {
  CreateTimeEntryComponent,
  CreateTimeEntryDispatches,
  CreateTimeEntryInputs,
} from './CreateTimeEntry';
import { TimeEntryModel } from './models/time-entry.model';
import { createTimeEntryAsync } from './shared/create-time-entry';
import { selectIsCreateTimeEntryBusy } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): CreateTimeEntryInputs => ({
  isBusy: selectIsCreateTimeEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): CreateTimeEntryDispatches => ({
  create: (model: TimeEntryModel) => dispatch(createTimeEntryAsync.request(model)),
});

export const CreateTimeEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTimeEntryComponent);
