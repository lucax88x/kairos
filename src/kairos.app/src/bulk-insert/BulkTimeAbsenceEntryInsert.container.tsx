import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectProfile } from '../profile/selectors';
import { selectIsOnline } from '../shared/selectors';
import { State } from '../state';
import { bulkInsertTimeAbsenceEntriesAsync } from './bulk-insert-time-absence-entries';
import {
  BulkTimeAbsenceEntryInsertComponent,
  BulkTimeAbsenceEntryInsertDispatches,
  BulkTimeAbsenceEntryInsertInputs,
} from './BulkTimeAbsenceEntryInsert';
import { selectIsBulkTimeAbsenceEntriesInsertBusy } from './selectors';

const mapStateToProps = (state: State): BulkTimeAbsenceEntryInsertInputs => ({
  isOnline: selectIsOnline(state),
  isBusy: selectIsBulkTimeAbsenceEntriesInsertBusy(state),
  profile: selectProfile(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): BulkTimeAbsenceEntryInsertDispatches => ({
  onBulkInsert: models =>
    dispatch(bulkInsertTimeAbsenceEntriesAsync.request({ models })),
});

export const BulkTimeAbsenceEntryInsert = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BulkTimeAbsenceEntryInsertComponent);
