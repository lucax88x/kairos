import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { TimeEntryModel } from '../models/time-entry.model';
import { State } from '../state';
import {
  EditTimeEntryComponent,
  EditTimeEntryDispatches,
  EditTimeEntryInputs,
} from './EditTimeEntry';
import {
  selectIsGetTimeEntryBusy,
  selectIsUpdateTimeEntryBusy,
  selectTimeEntry,
} from './selectors';
import { updateTimeEntryAsync } from './update-time-entry';

const mapStateToProps = (state: State): EditTimeEntryInputs => ({
  timeEntry: selectTimeEntry(state),
  isGetBusy: selectIsGetTimeEntryBusy(state),
  isUpdateBusy: selectIsUpdateTimeEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): EditTimeEntryDispatches => ({
  update: (model: TimeEntryModel) => dispatch(updateTimeEntryAsync.request({ model })),
});

export const EditTimeEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTimeEntryComponent);
