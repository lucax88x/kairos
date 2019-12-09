import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { openTimeAbsenceEntryDrawerAction } from '../layout/actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';
import { tryDeleteTimeAbsenceEntriesAction } from '../shared/delete-time-absence-entries';
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
import { RouteMatcher } from '../routes';

const mapStateToProps = (state: State): TimeAbsenceEntriesInputs => ({
  timeAbsenceEntries: selectTimeAbsenceEntries(state),
  isGetTimeAbsenceEntriesBusy: selectIsGetTimeAbsenceEntriesBusy(state),
  isDeleteTimeAbsenceEntriesBusy: selectIsDeleteTimeAbsenceEntriesBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): TimeAbsenceEntriesDispatches => ({
  onCreate: () => dispatch(openTimeAbsenceEntryDrawerAction()),
  onUpdate: (model: TimeAbsenceEntryModel) =>
    dispatch(push(RouteMatcher.EditTimeAbsenceEntry.replace(':id', model.id.toString()))),
  onDelete: (ids: UUID[]) => dispatch(tryDeleteTimeAbsenceEntriesAction(ids)),
});

export const TimeAbsenceEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeAbsenceEntriesComponent);
