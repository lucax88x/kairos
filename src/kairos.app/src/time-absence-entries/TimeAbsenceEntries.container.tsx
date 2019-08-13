import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { openTimeAbsenceEntryDrawerAction } from '../layout/actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { deleteTimeAbsenceEntryAsync } from '../shared/delete-time-absence-entry';
import {
  selectIsDeleteTimeAbsenceEntryBusy,
  selectIsGetTimeAbsenceEntriesBusy,
  selectTimeAbsenceEntries,
} from '../shared/selectors';
import { State } from '../state';
import {
  TimeAbsenceEntriesComponent,
  TimeAbsenceEntriesDispatches,
  TimeAbsenceEntriesInputs,
} from './TimeAbsenceEntries';

const mapStateToProps = (state: State): TimeAbsenceEntriesInputs => ({
  timeAbsenceEntries: selectTimeAbsenceEntries(state),
  isGetTimeAbsenceEntriesBusy: selectIsGetTimeAbsenceEntriesBusy(state),
  isDeleteTimeAbsenceEntryBusy: selectIsDeleteTimeAbsenceEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeAbsenceEntriesDispatches => ({
  onCreate: () => dispatch(openTimeAbsenceEntryDrawerAction()),
  onUpdate: (model: TimeAbsenceEntryModel) => dispatch(push(`/absence/${model.id}`)),
  onDelete: (model: TimeAbsenceEntryModel) =>
    dispatch(deleteTimeAbsenceEntryAsync.request({ model })),
});

export const TimeAbsenceEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeAbsenceEntriesComponent);
