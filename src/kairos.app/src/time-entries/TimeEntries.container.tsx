import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { openTimeEntryDrawerAction } from '../layout/actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { UUID } from '../models/uuid.model';
import { tryDeleteTimeEntriesAction } from '../shared/delete-time-entries';
import { selectIsDeleteTimeEntriesBusy, selectIsGetTimeEntriesBusy, selectTimeEntries } from '../shared/selectors';
import { State } from '../state';
import { TimeEntriesComponent, TimeEntriesDispatches, TimeEntriesInputs } from './TimeEntries';
import { RouteMatcher } from '../routes';

const mapStateToProps = (state: State): TimeEntriesInputs => ({
  timeEntries: selectTimeEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
  isDeleteTimeEntriesBusy: selectIsDeleteTimeEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeEntriesDispatches => ({
  onCreate: () => dispatch(openTimeEntryDrawerAction()),
  onUpdate: (model: TimeEntryListModel) => dispatch(push(RouteMatcher.EditTimeEntry.replace(':id', model.id.toString()))),
  onDelete: (ids: UUID[]) => dispatch(tryDeleteTimeEntriesAction( ids)),
});

export const TimeEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesComponent);
