import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { openTimeEntryDrawerAction } from '../layout/actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
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
  onCreate: () => dispatch(openTimeEntryDrawerAction()),
  onUpdate: (model: TimeEntryListModel) => dispatch(push(`/entry/${model.id}`)),
  onDelete: (model: TimeEntryListModel) => dispatch(deleteTimeEntryAsync.request({ id: model.id })),
});

export const TimeEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesComponent);
