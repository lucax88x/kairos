import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { deleteTimeAbsenceEntryAsync } from '../shared/delete-time-absence-entry';
import { selectIsDeleteTimeAbsenceEntryBusy } from '../shared/selectors';
import { State } from '../state';
import { selectIsGetTimeAbsenceEntriesBusy, selectTimeAbsenceEntries } from './selectors';
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
  onUpdate: (model: TimeAbsenceEntryModel) => dispatch(push(`/absence/${model.id}`)),
  onDelete: (model: TimeAbsenceEntryModel) =>
    dispatch(deleteTimeAbsenceEntryAsync.request({ model })),
});

export const TimeAbsenceEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeAbsenceEntriesComponent);
