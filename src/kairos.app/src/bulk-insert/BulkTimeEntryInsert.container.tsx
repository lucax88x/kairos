import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectProfile } from '../profile/selectors';
import { State } from '../state';
import { bulkInsertTimeEntriesAsync } from './bulk-insert-time-entries';
import {
  BulkTimeEntryInsertComponent,
  BulkTimeEntryInsertDispatches,
  BulkTimeEntryInsertInputs,
} from './BulkTimeEntryInsert';
import { selectIsBulkTimeEntriesInsertBusy } from './selectors';

const mapStateToProps = (state: State): BulkTimeEntryInsertInputs => ({
  profile: selectProfile(state),
  isBusy: selectIsBulkTimeEntriesInsertBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): BulkTimeEntryInsertDispatches => ({
  onBulkInsert: models => dispatch(bulkInsertTimeEntriesAsync.request({ models })),
});

export const BulkTimeEntryInsert = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BulkTimeEntryInsertComponent);
