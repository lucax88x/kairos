import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { openTimeAbsenceEntryDrawerAction } from '../layout/actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { deleteTimeAbsenceEntriesAsync } from '../shared/delete-time-absence-entries';
import {
  selectIsDeleteTimeAbsenceEntriesBusy,
  selectIsGetTimeAbsenceEntriesBusy,
  selectTimeAbsenceEntries,
} from '../shared/selectors';
import { State } from '../state';
import {
  TimeAbsenceEntriesComponent,
  TimeAbsenceEntriesDispatches,
  TimeAbsenceEntriesInputs,
} from './TimeAbsenceEntries';
import { UUID } from '../models/uuid.model';

const mapStateToProps = (state: State): TimeAbsenceEntriesInputs => ({
  timeAbsenceEntries: selectTimeAbsenceEntries(state),
  isGetTimeAbsenceEntriesBusy: selectIsGetTimeAbsenceEntriesBusy(state),
  isDeleteTimeAbsenceEntriesBusy: selectIsDeleteTimeAbsenceEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeAbsenceEntriesDispatches => ({
  onCreate: () => dispatch(openTimeAbsenceEntryDrawerAction()),
  onUpdate: (model: TimeAbsenceEntryModel) => dispatch(push(`/absence/${model.id}`)),
  onDelete: (ids: UUID[]) => dispatch(deleteTimeAbsenceEntriesAsync.request({ ids })),
});

export const TimeAbsenceEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeAbsenceEntriesComponent);
