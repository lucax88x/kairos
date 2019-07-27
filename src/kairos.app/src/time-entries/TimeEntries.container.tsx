import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { TimeEntryModel } from '../models/time-entry.model';
import { deleteTimeEntryAsync } from '../shared/delete-time-entry';
import {
  selectIsDeleteTimeEntryBusy,
  selectIsGetTimeEntriesBusy,
  selectTimeEntries,
} from '../shared/selectors';
import { State } from '../state';
import { TimeEntriesComponent, TimeEntriesDispatches, TimeEntriesInputs } from './TimeEntries';

const mapStateToProps = (state: State): TimeEntriesInputs => ({
  timeEntries: selectTimeEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
  isDeleteTimeEntryBusy: selectIsDeleteTimeEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeEntriesDispatches => ({
  onUpdate: (model: TimeEntryModel) => dispatch(push(`/entry/${model.id}`)),
  onDelete: (model: TimeEntryModel) => dispatch(deleteTimeEntryAsync.request({ model })),
});

export const TimeEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesComponent);
