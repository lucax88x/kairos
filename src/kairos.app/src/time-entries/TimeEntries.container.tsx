import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { openTimeEntryDrawerAction } from '../layout/actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { deleteTimeEntriesAsync as deleteTimeEntriesAsync } from '../shared/delete-time-entries';
import {
  selectIsDeleteTimeEntriesBusy,
  selectIsGetTimeEntriesBusy,
  selectTimeEntries,
} from '../shared/selectors';
import { State } from '../state';
import { TimeEntriesComponent, TimeEntriesDispatches, TimeEntriesInputs } from './TimeEntries';
import { UUID } from '../models/uuid.model';

const mapStateToProps = (state: State): TimeEntriesInputs => ({
  timeEntries: selectTimeEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
  isDeleteTimeEntriesBusy: selectIsDeleteTimeEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeEntriesDispatches => ({
  onCreate: () => dispatch(openTimeEntryDrawerAction()),
  onUpdate: (model: TimeEntryListModel) => dispatch(push(`/entry/${model.id}`)),
  onDelete: (ids: UUID[]) => dispatch(deleteTimeEntriesAsync.request({ ids })),
});

export const TimeEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesComponent);
