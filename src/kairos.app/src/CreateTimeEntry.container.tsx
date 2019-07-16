import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from './actions';
import {
  CreateTimeEntryComponent,
  CreateTimeEntryDispatches,
  CreateTimeEntryInputs,
} from './CreateTimeEntry';
import { TimeEntryTypes } from './models/time-entry.model';
import { createTimeEntryAsync } from './shared/create-time-entry';
import { selectIsCreateTimeEntryBusy } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): CreateTimeEntryInputs => ({
  isBusy: selectIsCreateTimeEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): CreateTimeEntryDispatches => ({
  createTimeEntry: (type: TimeEntryTypes, when: Date) =>
    dispatch(createTimeEntryAsync.request({ type, when })),
});

export const CreateTimeEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTimeEntryComponent);
